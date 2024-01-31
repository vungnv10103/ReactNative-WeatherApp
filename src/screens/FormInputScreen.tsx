import { View, Text, StatusBar, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView, ImageBackground, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import uuid from 'react-native-uuid';
import { auth, database, storage } from '../config/firebase.config';
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get, update, set } from "firebase/database";


import FlashMessage, { showMessage, hideMessage, MessageType } from "react-native-flash-message";

import ImagePicker from 'react-native-image-crop-picker';
import Animated, {
    FadeInDown,
    FadeInUp,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IConfig } from '../interface/_index';

const durationLoading = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);


export default function FormInputScreen(props: any) {
    const sv = useSharedValue(0);
    const [selectedImage, setSelectedImage] = useState({
        uri: ''
    });
    const [apiWeather, setApiWeather] = useState('')
    const [apiGoogle, setApiGoogle] = useState('')
    const [apiLocation, setApiLocation] = useState('')
    const [img, setImage] = useState('')
    const [currentUser, setUser] = useState<User>();
    const [isShowView, setShowView] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isShowAreaImage, setShowAreaImage] = useState(false)
    const [progress, setProgress] = useState("");


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    const handleClose = () => { props.navigation.goBack() }

    const handleReset = async () => {
        await writeUserData(currentUser?.uid, "", "", "", false);
    }

    const writeUserData = async (userId: string | undefined, apiWeather: string, apiGoogle: string, apiLocation: string, isChangeAPI: boolean) => {
        if (userId !== undefined) {
            setShowView(false);
            setLoading(true);
            // write config
            await set(databaseRef(database, `app/config/user/${userId}/0/change_api`), true);
            await set(databaseRef(database, `app/config/user/${userId}/0/api`), {
                apiWeather,
                apiGoogle,
                apiLocation
            });
            setLoading(false);
            setShowView(true);
        }
    }

    const handleSubmit = async () => {
        await writeUserData(currentUser?.uid, apiWeather, apiGoogle, apiLocation, true);
        if (selectedImage.uri.length > 0) {
            await uploadImage(currentUser?.uid, selectedImage.uri);
        }
    }


    const handleImagePicker = () => {
        ImagePicker.openPicker({
            maxHeight: 512,
            maxWidth: 512,
            cropping: true,
        }).then(async (image) => {
            const selectedImage = { uri: image.path };
            setSelectedImage(selectedImage)
            // await uploadImageToFirebase(selectedImage, "png");
        }).catch(error => {
            if (error.message !== "User cancelled image selection") {
                console.log(error.message);
            }
        });
    };

    const logout = () => {
        signOut(auth).then(async () => {
            await AsyncStorage.setItem('status', "logout");
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const checkUserLogged = async (): Promise<User> => {
        return new Promise<any>((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setShowView(true);
                    resolve(user)
                }
                else {
                    logout();
                }
            });
        });
    }

    const uploadImage = async (idUser: string | undefined, imageSelected: string) => {
        if (idUser !== undefined) {
            setShowView(false);
            setLoading(true);
            try {
                const response = await fetch(imageSelected);
                const blob = await response.blob()
                const fileName = `${uuid.v4()}.png`;
                const mStorageRef = storageRef(storage, `images/${idUser}/` + fileName)
                const uploadTask = uploadBytesResumable(mStorageRef, blob)
                uploadTask.on("state_changed", (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgress(progress.toFixed())
                },
                    (error) => {
                        // Handle error
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downLoadURL: any) => {
                            // save record
                            console.log("File at: " + downLoadURL);
                        })
                    }
                )
            } catch (error) {
                console.error('Error uploading image to Firebase Storage', error);
            } finally {
                setShowView(true);
                setLoading(false);
            }
        }
    }


    const getConfigAppByUser = async (idUser: string | undefined): Promise<IConfig> => {
        return new Promise<any>((resolve) => {
            const dbRef = databaseRef(database, `app/config/user/${idUser}`);
            onValue(dbRef, (snapshot) => {
                const configData: any[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    configData.push(childData);
                });
                const config: IConfig[] = configData;
                resolve(config[0]);
            }, {
                onlyOnce: true
            });
        });
    }

    const fetchData = async () => {
        let currentUser = await checkUserLogged();
        setUser(currentUser);
        let { upload, change_api, maintain, name } = await getConfigAppByUser(currentUser?.uid);
        if (upload) {
            setShowAreaImage(true);
        }
    }


    useEffect(() => {
        if (!isShowView) {
            sv.value = withRepeat(withTiming(1, { duration: durationLoading, easing }), -1);
        }
        fetchData();
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />

            {isShowView ? (
                <View className="flex-1 ">
                    <StatusBar barStyle="light-content" />
                    <View className='flex-row items-center my-3'>
                        <TouchableOpacity
                            onPress={() => props.navigation.goBack()}
                            className="p-2 rounded-full ml-5 bg-gray-400">
                            <Ionicons
                                name={'chevron-back'} color={'white'} size={24}
                                style={{
                                    textAlign: 'center',
                                }}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontFamily: 'Inter-Bold' }}
                            className='text-white text-xl mx-4'>
                            Tuỳ chỉnh API KEY
                        </Text>
                    </View>

                    <ScrollView
                        className="space-y-1 pt-2 mx-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    >
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white py-1 mt-2 underline"
                            onPress={() => Linking.openURL("https://www.weatherapi.com")}
                        >
                            {`API Weather\nhttps://www.weatherapi.com`}
                        </Text>
                        <TextInput
                            className="text-white p-3 rounded border-gray-300 border"
                            style={{ fontFamily: 'Inter-Medium' }}
                            value={apiWeather}
                            onChangeText={(text) => setApiWeather(text)}
                        />

                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white py-1 mt-2 underline"
                            onPress={() => Linking.openURL("https://console.cloud.google.com")}
                        >
                            {`API Google\nhttps://console.cloud.google.com`}
                        </Text>
                        <TextInput
                            className="text-white p-3 rounded border-gray-300 border"
                            style={{ fontFamily: 'Inter-Medium' }}
                            value={apiGoogle}
                            onChangeText={(text) => setApiGoogle(text)}
                        />

                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white py-1 mt-2 underline"
                            onPress={() => Linking.openURL("https://opencagedata.com")}
                        >
                            {` API Location\nhttps://opencagedata.com`}
                        </Text>
                        <TextInput
                            className="text-white p-3 rounded border-gray-300 border"
                            style={{ fontFamily: 'Inter-Medium' }}
                            value={apiLocation}
                            onChangeText={(text) => setApiLocation(text)}
                        />
                        {isShowAreaImage && <View>
                            {selectedImage.uri.length > 0 ? (
                                <Image
                                    className="w-36 h-36 my-3"
                                    source={{ uri: `${selectedImage.uri}` }} />
                            ) :
                                (
                                    <Image
                                        className="w-36 h-36 my-3"
                                        source={require('../assets/images/app_icon.png')} />
                                )
                            }
                            <TouchableOpacity
                                className=" bg-sky-400  py-2 px-2 rounded-lg mb-3 my-2 "
                                onPress={handleImagePicker}>
                                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Select Image</Text>
                            </TouchableOpacity>
                        </View>}

                        <View className="flex-row justify-around pt-10">
                            {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
                                <TouchableOpacity
                                    className=" bg-sky-400 py-2 px-3 rounded-lg mb-3 "
                                    onPress={handleSubmit}>
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-sm text-white text-center">Cập nhật</Text>
                                </TouchableOpacity>
                            </>}
                            <TouchableOpacity
                                className=" bg-gray-400 py-2 px-4 rounded-lg mb-3"
                                onPress={handleReset}>
                                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Reset API</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>) : (
                <View className='m-5 flex-1 justify-center items-center h-full'>
                    <Animated.View className='h-16 w-16 bg-teal-400 rounded-2xl' style={[animatedStyle]}>

                    </Animated.View>
                    <FlashMessage position="top" />
                </View>
            )
            }
        </ImageBackground >
    )
}
