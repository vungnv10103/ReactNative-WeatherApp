import { View, Text, TextInput, ImageBackground, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { auth } from '../config/firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, set } from "firebase/database";

const durationToast = 700;
const timeoutAPI = 30000;
import FlashMessage, { showMessage, hideMessage, MessageType } from "react-native-flash-message";

export default function SignupScreen(props: any) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);



    const toastMsg = async (title: string, message: string, type: MessageType | null) => {
        showMessage({
            message: title,
            description: message,
            type: type != null ? type : 'default',
            duration: durationToast,
            onHide() {
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Navigation' }],
                });
            },
        });
    }

    const writeUserData = async (userId: string, name: string, email: string | null) => {
        setLoading(true);
        const db = getDatabase();
        await set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
        });
        setLoading(false);
        toastMsg("", "Signup success", "success");
    }


    const sigup = async () => {
        setLoading(true);
        if (username.length == 0) {
            setLoading(false);
            toastMsg("", "Vui lòng điền username", "warning");
        }
        else if (email.length == 0) {
            setLoading(false);
            toastMsg("", "Vui lòng điền email", "warning");
        }
        else if (password.length == 0) {
            setLoading(false);
            toastMsg("111", "Vui lòng điền password", "warning");
        }
        else {
            try {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                if (response) {
                    console.log(response);
                    const user = response.user;
                    writeUserData(user.uid, username, user.email);
                }

            } catch (error: any) {
                const { code, message } = error;
                console.log(code);
                switch (code) {
                    case 'auth/email-already-in-use':
                        toastMsg("", "Email đã được sử dụng \nVui lòng dùng email khác", "warning");
                        break;
                    case 'auth/weak-password':
                        toastMsg("", "Mật khẩu tối thiểu 6 kí tự", "warning");
                        break;

                    default:
                        toastMsg("", message, "warning");
                        break;
                }
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />
            <View className="flex justify-around pt-20">
                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        style={{ fontFamily: 'Inter-Bold' }}
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-white tracking-wider text-5xl">
                        Sign Up
                    </Animated.Text>
                </View>

                {/* form */}
                <View className="flex items-center mx-5 space-y-4 pt-20">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-white/5 p-1.5 rounded-lg w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'white' }}
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            placeholder="Username"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-white/5 p-1.5 rounded-lg w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'white' }}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        className="bg-white/5 p-1.5 rounded-lg w-full mb-3">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'white' }}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                        />
                    </Animated.View>

                    <Animated.View className="w-full" entering={FadeInDown.delay(600).duration(1000).springify()}>
                        {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
                            <TouchableOpacity
                                className="w-full bg-sky-400 p-3 rounded-lg mb-3"
                                onPress={sigup}
                            >
                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Signup</Text>
                            </TouchableOpacity>
                        </>}
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="flex-row justify-center p-1">

                        <Text style={{ fontFamily: 'Inter-Medium' }} className='text-gray-400'>Already have an account? </Text>
                        <TouchableOpacity onPress={() => props.navigation.push('Login')}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white">Login</Text>
                        </TouchableOpacity>

                    </Animated.View>
                </View>
                <FlashMessage position="top" />
            </View>
        </ImageBackground>
    )
}