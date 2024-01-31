import { View, Text, StatusBar, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { auth, database, storage } from '../config/firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
    const [isShowView, setShowView] = useState(false);
    const [loading, isLoading] = useState(false)
    const [progress, setProgress] = useState(0);


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    const handleClose = () => { props.navigation.goBack() }

    const handleSubmit = async () => {
        // check input api
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

    const checkUserLogged = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setShowView(true);
            }
            else {
                logout();
            }
        });
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
                            Form
                        </Text>
                    </View>

                    <ScrollView
                        className="space-y-1 pt-2 mx-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    >
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white py-1 mt-2">API Weather</Text>
                        <TextInput
                            className="text-white p-3 rounded border-gray-300 border"
                            style={{ fontFamily: 'Inter-Medium' }}
                            value={apiWeather}
                            onChangeText={(text) => setApiWeather(text)}
                        />

                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white py-1 mt-2">API Google</Text>
                        <TextInput
                            className="text-white p-3 rounded border-gray-300 border"
                            style={{ fontFamily: 'Inter-Medium' }}
                            value={apiGoogle}
                            onChangeText={(text) => setApiGoogle(text)}
                        />

                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white py-1 mt-2">API Location</Text>
                        <TextInput
                            className="text-white p-3 rounded border-gray-300 border"
                            style={{ fontFamily: 'Inter-Medium' }}
                            value={apiLocation}
                            onChangeText={(text) => setApiLocation(text)}
                        />

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


                        <View className="flex-row justify-around mt-3">
                            {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
                                <TouchableOpacity
                                    className=" bg-sky-400 py-2 px-3 rounded-lg mb-3 "
                                    onPress={handleSubmit}>
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-sm text-white text-center">Cập nhật</Text>
                                </TouchableOpacity>
                            </>}
                            <TouchableOpacity
                                className=" bg-gray-400 py-2 px-4 rounded-lg mb-3"
                                onPress={handleClose}>
                                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Huỷ</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>) : (
                <View className='m-5 flex-1 justify-center items-center h-full'>
                    <Animated.View className='h-16 w-16 bg-teal-400 rounded-2xl' style={[animatedStyle]}>

                    </Animated.View>
                    <FlashMessage position="top" />
                </View>
            )}
        </ImageBackground>
    )
}
