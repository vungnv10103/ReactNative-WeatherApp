import { View, Text, ImageBackground, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';


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
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);



export default function NotificationScreen(props: any) {
    const sv = useSharedValue(0);

    const [isShowView, setShowView] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    useEffect(() => {
        if (!isShowView) {
            sv.value = withRepeat(withTiming(1, { duration: durationLoading, easing }), -1);
        }
        setTimeout(() => {
            setShowView(true);
        }, 5000);
    }, []);
    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <StatusBar barStyle="default" />
            {isShowView ? (
                <View className="flex-1 m-5 pt-20">

                    <FlashMessage position="top" />
                </View>
            ) : (
                <View className='m-5 flex-1 justify-center items-center h-full'>
                    <Animated.View className='h-16 w-16 bg-pink-400 rounded-2xl' style={[animatedStyle]}>

                    </Animated.View>
                    <FlashMessage position="top" />
                </View>
            )}
        </ImageBackground >
    )
}
