import { View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { theme } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    FadeIn,
    FadeOut,
    withTiming,
    withRepeat,
} from 'react-native-reanimated';


export default function HomeScreen() {


    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([1, 2, 3]);
    const [daily, setDaily] = useState([1, 2, 3, 4, 5, 6, 7]);

    const demo = () => {
        console.log("hello");
    }

    const handleLocation = (location: number): void => {
        console.log(location);

    }
    useEffect(() => {

    }, [])


    return (
        <View className="flex-1 relative">
            <StatusBar barStyle={'default'} />
            <Image blurRadius={80}
                source={require('../assets/images/bg.png')}
                className='absolute h-full w-full' />
            <SafeAreaView className='flex flex-1'>
                {/* Search */}
                <View className='mx-4 mt-4 relative z-50'>
                    <Animated.View entering={FadeIn.delay(100).duration(500)} style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }} className='flex-row justify-end items-center rounded-full'>
                        {
                            showSearch ? (<TextInput
                                style={{ fontFamily: 'Inter-Bold' }}
                                placeholder='Search city'
                                placeholderTextColor={'lightgray'}
                                className='pl-5 h-full flex-1 text-lg text-white' />) : null
                        }
                        <TouchableOpacity style={{ backgroundColor: theme.bgWhite(0.3) }} className='rounded-full p-2 m-1.5'
                            onPress={() => toggleSearch(!showSearch)}>
                            <Ionicons name={'search'} color={'white'} size={26} />
                        </TouchableOpacity>
                    </Animated.View>
                    {
                        locations.length > 0 && showSearch ? (
                            <View className='absolute w-full bg-gray-300 top-14 rounded-3xl'>
                                {
                                    locations.map((location, index) => {
                                        let showBorder = index + 1 != locations.length;
                                        let borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';


                                        return (
                                            <TouchableOpacity key={index}
                                                onPress={() => handleLocation(location)}
                                                className={'flex-row items-center border-0 p-3 px-4 mb-0.5' + borderClass}>
                                                <Ionicons name={'location'} color={'gray'} size={18} />
                                                <Text className='text-black text-sm ml-2'>Ha Noi, Nam Dinh, Hai Phong</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ) : (<View></View>)
                    }
                </View>

                {/* forecast section */}
                <View className='mx-4 flex flex-1 justify-around mb-2'>
                    {/* location */}
                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-center text-2xl'>
                        Hanoi, <Text style={{ fontFamily: "Inter-Medium" }} className='text-lg text-gray-300'>Viet Nam</Text>
                    </Text>
                    {/* weather image */}
                    <View className='flex-row justify-center'>
                        <Image className='w-52 h-52' source={require('../assets/images/moderaterain.png')} />
                    </View>
                    {/* degree celcius */}
                    <View className='space-y-2'>
                        <Text style={{ fontFamily: "Inter-Bold" }} className='text-center text-white text-6xl ml-5'>
                            16&#176;
                        </Text>
                        <Text style={{ fontFamily: "Inter-Bold" }} className='text-center text-white text-xl tracking-widest'>
                            Raining
                        </Text>
                    </View>
                    {/* other status */}

                    <View className='flex-row justify-between mx-4'>
                        <View className='flex-row space-x-2 items-center'>
                            <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/wind_1.png')} />
                            <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                22km
                            </Text>
                        </View>
                        <View className='flex-row space-x-2 items-center'>
                            <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/drop.png')} />
                            <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                23%
                            </Text>
                        </View>
                        <View className='flex-row space-x-2 items-center'>
                            <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/sun.png')} />
                            <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                4:35 PM
                            </Text>
                        </View>
                    </View>
                </View>

                {/* forecase for nextday */}
                <View className='mb-2 space-y-3'>
                    <View className='flex-row items-center mx-5 space-x-2'>
                        <Ionicons name={'calendar-outline'} color={'white'} size={22} />
                        <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>Daily forecast</Text>
                    </View>

                    {
                        daily.length > 0 ? (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 15 , paddingBottom: 50}}
                            >
                                {
                                    daily.map((item) => {
                                        return (
                                            <TouchableOpacity key={item} style={{ backgroundColor: theme.bgWhite(0.15) }}
                                                className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'>
                                                <Image className='h-11 w-11' source={require('../assets/images/heavyrain.png')} />
                                                <Text style={{ fontFamily: "Inter-Medium" }} className='text-white'>Monday</Text>
                                                <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-xl'>20&#176;</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        ) : null
                    }

                </View>
            </SafeAreaView>
        </View>
    )
}
