import { View, Text, TextInput, ImageBackground, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

import { apiKeyOpenCage } from '../constants';
import { ILocation, IWeather, IForecastDay } from '../interface/_index'
import { convertENtoVi, formatTemperature, getImageSource, removeVietnameseAccent } from '../utils';
import { auth } from '../config/firebase.config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';

import Animated, {
    FadeInDown,
    FadeInUp,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';


const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);


export default function LoginScreen(props: any) {
    const sv = useSharedValue(0);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const [isShowView, setShowView] = useState(false);
    const [isLogged, setLogged] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    const getCurrentLocation = async () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                // console.log(location);
                let myLat = location.latitude;
                let myLon = location.longitude;
                fetch('https://api.opencagedata.com/geocode/v1/json?q=' + myLat + ',' + myLon + '&key=' + apiKeyOpenCage)
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        if (responseJson.status.code == 200) {
                            if (responseJson.rate.remaining <= 10) {
                                console.log("Limit request");
                            }
                            else {
                                let county: string = responseJson.results[0].components.county;
                                let state: string = responseJson.results[0].components.state;
                                let country: string = responseJson.results[0].components.country;
                                let countyCurrent = removeVietnameseAccent(county.substring(0, county.indexOf("District")));
                                let location: ILocation = {
                                    name: countyCurrent,
                                    country: country,
                                    lat: myLat,
                                    lon: myLon
                                }
                                let dataLocation = JSON.stringify(location);
                                await AsyncStorage.setItem('location', dataLocation);
                            }
                        }
                    });
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            });
    }

    const getWeatherPrevious = async () => {
        let previusLocation: string | null = await AsyncStorage.getItem('location');
        if (previusLocation == null) {
            await getCurrentLocation();
        }
    }

    const login = async () => {
        setLoading(true);
        if (email.length == 0) {
            setLoading(false);
        } else if (password.length == 0) {
            setLoading(false);
        }
        else {
            try {
                const response = await signInWithEmailAndPassword(auth, email, password);
                let data = JSON.stringify(response, null, 2);
                const user = response.user;
                if (user != null) {
                    setLogged(true);
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }
            } catch (error: any) {
                const { code, message } = error;
                console.log(code);
                switch (code) {
                    case "auth/missing-password":
                        // alert('Vui lòng điền mật khẩu')
                        break;
                    case "auth/invalid-email":
                        // alert("Email không đúng định dạng")
                        break;
                    case "auth/network-request-failed":
                        // alert("Vui lòng kết nối internet")
                        break;

                    default:
                        // alert('login failed: ' + error.message)
                        break;
                }
            } finally {
                setLoading(false);
            }
        }
    }

    const checkUserLogged = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLoading(false);
                setLogged(true);
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
            else {
                setShowView(true);
            }
        });
    }
    useEffect(() => {
        if (!isLogged) {
            sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
        }
        checkUserLogged();
        getWeatherPrevious();
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />
            {isShowView ? (<View className="flex justify-around pt-20">
                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        style={{ fontFamily: 'Inter-Bold' }}
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-white  tracking-wider text-5xl">
                        Login
                    </Animated.Text>

                </View>

                {/* form */}
                <View className="flex items-center mx-5 space-y-4 pt-20">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-white/5 p-1.5 rounded-lg w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium' }}
                            className="text-white"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-white/5 p-1.5 rounded-lg w-full mb-3">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium' }}
                            className="text-white"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                        />
                    </Animated.View>
                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        {isLoading ? <ActivityIndicator size={"large"} color='#38bdf8' /> : <>
                            <TouchableOpacity
                                className="w-full bg-sky-400 p-3 rounded-lg mb-3"
                                onPress={login}>
                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Login</Text>
                            </TouchableOpacity>
                        </>}
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(600).duration(1000).springify()}
                        className="flex-row justify-center p-1">

                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-400">Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={() => props.navigation.push('Signup')}
                        >
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white">Signup</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>) : (<View className='flex-1 justify-center items-center h-full'>
                <Animated.View className='h-16 w-16 bg-red-400 rounded-2xl' style={[animatedStyle]}>

                </Animated.View>
            </View>)}

        </ImageBackground>
    )
}