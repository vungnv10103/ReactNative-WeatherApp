import { View, Text, TextInput, ImageBackground, StatusBar, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

import { auth, database } from '../config/firebase.config';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { ref, set } from "firebase/database";

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage, MessageType } from "react-native-flash-message";


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
const durationToast = 1000;
const timeoutAPI = 60000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);


export default function SignupScreen(props: any) {
    const sv = useSharedValue(0);

    const [isShowView, setShowView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isShowPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!isShowPassword);
    };

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    const handleEvent = async (title: string, message: string, type: MessageType | null, eventType?: string, delay?: number) => {
        showMessage({
            message: title,
            description: message,
            type: type != null ? type : 'default',
            duration: delay || durationToast,
            // onHide() {
            //     switch (eventType) {
            //         case "signup_success":
            //             props.navigation.reset({
            //                 index: 0,
            //                 routes: [{ name: 'Navigation' }],
            //             });
            //             break;

            //         default:
            //             console.log("signup: eventType: ", eventType);
            //             break;
            //     }

            // },
        });
    }

    const writeUserData = async (userId: string, name: string, email: string | null) => {
        setLoading(true);
        // write data
        await set(ref(database, `users/${userId}`), {
            username: name,
            email: email,
        });
        // write config
        await set(ref(database, `app/config/user/${userId}/0`), {
            maintain: false,
            email: email,
            name: name
        });
        setLoading(false);
    }

    const handleSignup = async (user: User) => {
        await writeUserData(user.uid, username, user.email);
        handleEvent("Thông báo !", "Đăng ký thành công.", "success", "signup_success");
    }

    const sigup = async () => {
        setLoading(true);
        if (username.length == 0) {
            console.log("username");
            handleEvent("Thông báo !", "Vui lòng điền username", "warning");
            setLoading(false);
        }
        else if (email.length == 0) {
            console.log("email");
            handleEvent("Thông báo !", "Vui lòng điền email", "warning");
            setLoading(false);
        }
        else if (password.length == 0) {
            console.log("password");
            handleEvent("Thông báo !", "Vui lòng điền password", "warning");
            setLoading(false);
        }
        else {
            try {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                if (response) {
                    console.log(response.user);
                    const user = response.user;
                    // handleSignup(user);
                }
            } catch (error: any) {
                const { code, message } = error;
                console.log(code);
                switch (code) {
                    case 'auth/email-already-in-use':
                        handleEvent("Lỗi !", "Email đã được sử dụng \nVui lòng dùng email khác", "danger");
                        break;
                    case 'auth/weak-password':
                        handleEvent("Lỗi !", "Mật khẩu tối thiểu 6 kí tự", "danger");
                        break;

                    default:
                        handleEvent("Lỗi !", message, "danger");
                        break;
                }
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (!isShowView) {
            sv.value = withRepeat(withTiming(1, { duration: durationLoading, easing }), -1);
        }
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />
            {isShowView ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ marginBottom: 30 }}
                >
                    <View className="flex justify-around my-5 pt-20">
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
                                className="bg-white/5 flex-row justify-between items-center p-1.5 rounded-lg w-full mb-3">
                                <TextInput
                                    style={{ fontFamily: 'Inter-Medium', color: 'white', width: '90%' }}
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    placeholder="Password"
                                    placeholderTextColor={'gray'}
                                    secureTextEntry={!isShowPassword}
                                />
                                <Ionicons
                                    name={'eye'} color={'white'} size={24}
                                    style={{
                                        width: '10%',
                                        marginLeft: 2,
                                        textAlign: 'center',
                                    }}
                                    onPress={toggleShowPassword}
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
                        <FlashMessage style={{ marginHorizontal: 20 }} position="top" />
                    </View>
                </ScrollView>
            ) : (
                <View className='m-5 flex-1 justify-center items-center h-full'>
                    <Animated.View className='h-16 w-16 bg-red-400 rounded-2xl' style={[animatedStyle]}>
                    </Animated.View>
                    <FlashMessage position="top" />
                </View>
            )}
        </ImageBackground>
    )
}
