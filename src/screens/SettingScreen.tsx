import { View, Text, StatusBar, TouchableOpacity, ImageBackground, Button } from 'react-native'
import React, { useState, useEffect } from 'react'

import { IUser } from '../interface/_index';

import { auth } from '../config/firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import FlashMessage, { showMessage, hideMessage, MessageType } from "react-native-flash-message";
const durationToast = 700;
const timeoutAPI = 30000;
import ToastMessage from '../components/ToastMessage';

export default function SettingScreen(props: any) {

    const [isLoading, setLoading] = useState(true);
    const [currentUser, setUser] = useState<IUser>();


    const checkUserLogged = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
            }
            else {
                logout();
            }
        });
    }

    const logout = () => {
        signOut(auth).then(async () => {
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


    useEffect(() => {
        checkUserLogged();
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />


            <View className="m-5 pt-20">
                <Text className='text-white'>{currentUser?.email}</Text>

                {/* Logout */}
                <TouchableOpacity
                    className="w-full bg-sky-400 p-3 rounded-xl mb-3 bottom-0"
                    onPress={() => handleEvent("Thông báo !", "Đăng xuất thành công", "success", "logout")}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đăng xuất</Text>
                </TouchableOpacity>
                <FlashMessage position="top" />
            </View>
        </ImageBackground >
    )
}
