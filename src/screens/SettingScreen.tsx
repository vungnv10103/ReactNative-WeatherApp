import { View, Text, StatusBar, TouchableOpacity, ImageBackground, Button } from 'react-native'
import React, { useState, useEffect } from 'react'

import { IUser } from '../interface/_index';

import { auth, database, storage } from '../config/firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get, update, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";


import FlashMessage, { showMessage, hideMessage, MessageType } from "react-native-flash-message";


const durationToast = 700;
const timeoutAPI = 30000;

import ToastMessage from '../components/ToastMessage';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Animated, {
    FadeInDown,
    FadeInUp,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';


const durationLoading = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);


export default function SettingScreen(props: any) {
    const sv = useSharedValue(0);

    const [selectedImage, setSelectedImage] = useState(null);
    const [progress, setProgress] = useState<number | any>(0)
    const [isFomInputVisiable, setFormInputVisiable] = useState(false);

    const [isShowView, setShowView] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [currentUser, setUser] = useState<IUser>();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));


    const checkUserLogged = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                setShowView(true);
            }
            else {
                logout();
            }
        });
    }

    const logout = () => {
        signOut(auth).then(async () => {
            await AsyncStorage.setItem('status', "logout");
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }).catch((error) => {
            handleEvent("Logout fail", error, "danger", "none");
            console.log(error);
        });
    }

    const handleEvent = async (title: string, message: string, type: MessageType | null, eventType: string) => {
        showMessage({
            message: title,
            description: message,
            type: type != null ? type : 'default',
            duration: durationToast,
            onHide() {
                switch (eventType) {
                    case "logout":
                        logout();
                        break;

                    default:
                        console.log("eventType: ", eventType);
                        break;
                }
            },
        });
    }

    const handleFormInputSubmit = async (idCate: string, idProduct: string, nameProduct: string, description: string, price: string, imageSelected: any) => {
        try {
            const response = await fetch(imageSelected.uri);
            const blob = await response.blob()
            const fileName = `${uuid.v4()}.png`;
            const mStorageRef = storageRef(storage, "images/" + fileName)
            const uploadTask = uploadBytesResumable(mStorageRef, blob)
            uploadTask.on("state_changed", (snapshot) => {
                const progress: any = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress.toFixed())
            },
                (error) => {
                    // Handle error
                    console.log(error.code);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downLoadURL: any) => {
                        // save record
                        console.log("File at: " + downLoadURL);
                        setSelectedImage(downLoadURL);

                        const dbRef = 'products';
                        const dataRef = databaseRef(database, dbRef);

                        // get key
                        const newDataRef = push(dataRef);
                        const dataID = newDataRef.key;
                        const newData = {
                            id: dataID,
                            idCate: idCate,
                            idSeller: currentUser?.uid,
                            name: nameProduct,
                            description: description,
                            price: price,
                            img: downLoadURL,
                            sold: 0,
                            status: 0,
                            sale: 0
                        };
                        try {
                            await runTransaction(dataRef, (currentData) => {
                                if (!currentData) {
                                    return [newData];
                                } else {
                                    currentData.push(newData);
                                    return currentData;
                                }
                            });
                            console.log('Thêm mới thành công!');

                        } catch (error) {
                            console.error('Thêm thất bại:', error);
                        }
                        setFormInputVisiable(false)
                    })
                }
            )
        } catch (error) {
            console.error('Error uploading image to Firebase Storage', error);
        }
    }

    useEffect(() => {
        if (!isShowView) {
            sv.value = withRepeat(withTiming(1, { duration: durationLoading, easing }), -1);
        }
        checkUserLogged();
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />
            {isShowView ? (
                <View className="flex-1 m-5 pt-20  space-y-4">
                    <Text style={{ fontFamily: 'Inter-Medium' }} className='text-white text-base'>
                        Email: <Text style={{ fontFamily: 'Inter-Bold' }} className='text-xl'>{currentUser?.email}</Text>
                    </Text>
                    <TouchableOpacity
                        className="w-full bg-sky-400 p-3 rounded-lg mb-3"
                        onPress={() => props.navigation.navigate("FormInput")}>
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Config</Text>
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity
                        className="w-full bg-sky-400 p-3 rounded-lg mb-3 absolute bottom-0"
                        onPress={() => handleEvent("Thông báo !", "Đăng xuất thành công", "success", "logout")}>
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đăng xuất</Text>
                    </TouchableOpacity>
                    <FlashMessage position="top" />
                </View>
            ) : (
                <View className='m-5 flex-1 justify-center items-center h-full'>
                    <Animated.View className='h-16 w-16 bg-teal-400 rounded-2xl' style={[animatedStyle]}>

                    </Animated.View>
                    <FlashMessage position="top" />
                </View>
            )}
        </ImageBackground >
    )
}
