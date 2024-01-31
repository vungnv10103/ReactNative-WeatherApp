import { View, Text, TextInput, ImageBackground, StatusBar, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'

import { apiKeyOpenCage } from '../constants';
import { IConfig, ILocation, IUser } from '../interface/_index'
import { removeVietnameseAccent } from '../utils';


import { auth, database } from '../config/firebase.config';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { ref as databaseRef, onValue, update, remove } from "firebase/database";

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import FlashMessage, { showMessage, hideMessage, MessageType } from "react-native-flash-message";


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


export default function LoginScreen(props: any) {
    const sv = useSharedValue(0);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isShowView, setShowView] = useState(false);
    const [isLogged, setLogged] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isShowPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!isShowPassword);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    const getConfigAppByKey = async (key: string) => {
        return new Promise<any>((resolve) => {
            const dbRef = databaseRef(database, `app/config/global/${key}`);
            onValue(dbRef, (snapshot) => {
                resolve(snapshot.val());
            }, {
                onlyOnce: true
            });
        });
    }

    const getConfigAppByUser = async (idUser: string): Promise<IConfig> => {
        return new Promise<any>((resolve) => {
            const dbRef = databaseRef(database, `app/config/user/${idUser}`);
            onValue(dbRef, (snapshot) => {
                const configData: any[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    // console.log("key: ", childKey);
                    // console.log(JSON.stringify(childData, null, 2));
                    configData.push(childData);
                });
                const config: IConfig[] = configData;
                resolve(config[0]);
            }, {
                onlyOnce: true
            });
        });
    }

    const handleEvent = async (title: string, message: string, type: MessageType | null, eventType: string, delay?: number) => {
        switch (eventType) {
            case "login_success":
                setLoading(false);
                setLogged(true);
                await AsyncStorage.setItem("status", "logged");
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Navigation' }],
                });
                break;

            case "maintain":
                setShowView(false);
                setLogged(false);
                setCurrentUser(null);
                setLoading(false);
                try {
                    await AsyncStorage.clear();
                } catch (e) {
                    console.log("AsyncStorage.clear(): ", e);
                }
                // await AsyncStorage.setItem('status', "expires");
                break;

            case "expires":
                setShowView(true);
                break;

            default:
                console.log("login: eventType: ", eventType);
                break;
        }
        showMessage({
            message: title,
            description: message,
            type: type != null ? type : 'default',
            duration: delay || durationToast,
        });
    }


    const getCurrentLocation = async () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: timeoutAPI,
        })
            .then(location => {
                console.log(`get location login screen`);
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
                console.warn(code, `login: ${message}`);
            });
    }

    const getWeatherPrevious = async () => {
        let previusLocation: string | null = await AsyncStorage.getItem('location');
        if (previusLocation == null) {
            await getCurrentLocation();
        }
    }
    const handleLogin = async (user: User) => {
        let { maintain } = await getConfigAppByUser(user.uid);
        if (maintain) {
            await handleEvent("Thông báo !", "Ứng dụng tạm đóng để tiến hành bảo trì.\nVui lòng quay lại sau.", "info", "maintain", 5000);
        } else {
            setCurrentUser(user);
            handleEvent("Thông báo !", "Đăng nhập thành công", "success", "login_success");
        }
    }

    const login = async () => {
        setLoading(true);
        if (email.length == 0) {
            handleEvent("Thông báo !", "Vui lòng điền email", "warning", "none");
            setLoading(false);
        } else if (password.length == 0) {
            handleEvent("Thông báo !", "Vui lòng điền password", "warning", "none");
            setLoading(false);
        }
        else {
            try {
                const response = await signInWithEmailAndPassword(auth, email, password);
                let data = JSON.stringify(response, null, 2);
                const user = response.user;
                if (user != null) {
                    handleLogin(user);
                }
            } catch (error: any) {
                const { code, message } = error;
                console.log(code);
                switch (code) {
                    case "auth/missing-password":
                        handleEvent("Lỗi !", "Vui lòng điền mật khẩu", "danger", "none");
                        break;
                    case "auth/invalid-email":
                        handleEvent("Lỗi !", "Email không đúng định dạng", "danger", "none");
                        break;
                    case "auth/network-request-failed":
                        handleEvent("Lỗi !", "Vui lòng kết nối internet", "danger", "none");
                        break;
                    case "auth/invalid-credential":
                        handleEvent("Lỗi !", "Thông tin không chính xác", "danger", "none");
                        break;

                    default:
                        handleEvent("Lỗi !", message, "danger", "none");
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
                handleLogin(user);
            } else {
                let status = await AsyncStorage.getItem('status');
                if (status === "expires") {
                    handleEvent("Thông báo !", "Phiên đăng nhập đã hết hạn.", "info", "expires", 2000);
                } else {
                    setShowView(true);
                }
            }
        });
    }

    const fetchData = async () => {
        let isMaintainMain = await getConfigAppByKey("maintain");
        if (isMaintainMain) {
            handleEvent("Thông báo !", "Ứng dụng tạm đóng để tiến hành bảo trì.\nVui lòng quay lại sau.", "info", "maintain", 5000);
        } else {
            await checkUserLogged();
            getWeatherPrevious();
        }
    }

    useEffect(() => {
        if (!isLogged) {
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    <View className="flex justify-around my-5 pt-20">
                        {/* title */}
                        <View className="flex items-center">
                            <Animated.Text
                                style={{ fontFamily: 'Inter-Bold' }}
                                entering={FadeInUp.duration(1000).springify()}
                                className="text-white  tracking-wider text-5xl"
                            >
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
                                className="bg-white/5 flex-row justify-between items-center p-1.5 rounded-lg w-full mb-3">
                                <TextInput
                                    style={{ fontFamily: 'Inter-Medium', width: '90%' }}
                                    className="text-white"
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    placeholder="Password"
                                    placeholderTextColor={'gray'}
                                    secureTextEntry={!isShowPassword}
                                />
                                <Ionicons
                                    name={isShowPassword ? 'eye' : 'eye-off'} color={'white'} size={24}
                                    style={{
                                        width: '10%',
                                        marginLeft: 2,
                                        textAlign: 'center',
                                    }}
                                    onPress={toggleShowPassword}
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
