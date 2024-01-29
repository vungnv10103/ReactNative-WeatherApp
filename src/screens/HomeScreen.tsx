import { View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { theme } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Animated, {
    FadeIn,
} from 'react-native-reanimated';

import { fetchLocation, fetchWeatherForecast } from '../service/api.weather';


import { ILocation, IWeather, IForecast } from '../interface/_index'
import { getImageSource } from '../constants';

export default function HomeScreen() {

    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState<ILocation[]>([]);
    const [weather, setWeather] = useState<any>({})

    const handleLocation = (location: ILocation): void => {
        setLocations([]);
        toggleSearch(false);
        fetchWeatherForecast({
            cityName: location.name,
            days: 7
        }).then(data => {
            console.log(data);

            setWeather(data);
        });

    }
    const handleSearch = (value: string) => {
        if (value.length < 2) return;
        fetchLocation({
            cityName: value
        }).then(data => {
            setLocations(data);
        });
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
    const { current, location } = weather;

    useEffect(() => {

    }, [])


    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            <ScrollView
                className=' flex-1 relative'
                showsVerticalScrollIndicator={false}
            >
                <StatusBar barStyle={'default'} />
                <SafeAreaView className='flex flex-1'>
                    {/* Search section */}
                    <View className='mx-4 mt-4 relative z-50'>
                        <Animated.View entering={FadeIn.delay(100).duration(500)}
                            style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}
                            className='flex-row justify-end items-center rounded-full'>
                            {
                                showSearch ? (<TextInput
                                    style={{ fontFamily: 'Inter-Bold' }}
                                    autoFocus={showSearch}
                                    onChangeText={handleTextDebounce}
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
                                <View className='absolute w-full bg-gray-300 mt-14 rounded-3xl'>
                                    {
                                        locations.map((location, index) => {
                                            let showBorder = index + 1 != locations.length;
                                            let borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';
                                            return (
                                                <TouchableOpacity key={index}
                                                    onPress={() => handleLocation(location)}
                                                    className={'flex-row items-center border-0 p-3 px-4 mb-0.5' + borderClass}>
                                                    <Ionicons name={'location'} color={'gray'} size={18} />
                                                    <Text className='text-black text-sm ml-2'>
                                                        {location?.name}, {location?.country}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            ) : (<View></View>)
                        }
                    </View>

                    {/* forecast section */}
                    <View className='mx-4 flex flex-1 mt-10 mb-2'>
                        {/* location */}
                        <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-center text-2xl'>
                            {location?.name != undefined ? location?.name + ", " : ""}
                            <Text style={{ fontFamily: "Inter-Medium" }} className='text-lg text-gray-300'>
                                {location?.country}
                            </Text>
                        </Text>
                        {/* weather image */}
                        <View className='flex-row justify-center'>
                            <Image
                                className='w-52 h-52'
                                source={getImageSource(current?.condition?.text)}
                            // source={{uri: `https:${current?.condition?.icon}`}}
                            />
                        </View>
                        {/* degree celcius */}
                        <View className='space-y-2 mt-4'>
                            <Text style={{ fontFamily: "Inter-Bold" }} className='text-center text-white text-6xl ml-5'>
                                {current?.temp_c}&#176;
                            </Text>
                            <Text style={{ fontFamily: "Inter-Bold" }} className='text-center text-white text-xl tracking-widest'>
                                {current?.condition?.text}
                            </Text>
                        </View>
                        {/* other status */}
                        <View className='flex-row justify-between mt-4 mx-4'>
                            <View className='flex-row space-x-2 items-center'>
                                <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/wind_1.png')} />
                                <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                    {current?.wind_kph}km/h
                                </Text>
                            </View>
                            <View className='flex-row space-x-2 items-center'>
                                <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/drop.png')} />
                                <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                    {current?.humidity}&#37;
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

                    {/* forecast for nextday */}
                    <View className='mt-5 mb-2 space-y-3'>
                        <View className='flex-row items-center mx-5 mt-4 space-x-2'>
                            <Ionicons name={'calendar-outline'} color={'white'} size={22} />
                            <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>Daily forecast</Text>
                        </View>
                        {
                            weather?.forecast?.forecastday.length > 0 ? (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
                                >
                                    {
                                        weather?.forecast?.forecastday.map((item: IForecast, index: number) => {
                                            // console.log(item?.day?.condition?.text);
                                            return (
                                                <TouchableOpacity key={index} style={{ backgroundColor: theme.bgWhite(0.15) }}
                                                    className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'>
                                                    <Image
                                                        className='h-11 w-11'
                                                        source={getImageSource(item?.day?.condition?.text)}
                                                    // source={require('../assets/images/heavyrain.png')}
                                                    />
                                                    <Text style={{ fontFamily: "Inter-Medium" }} className='text-white'>
                                                        {item?.date}
                                                    </Text>
                                                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-xl'>
                                                        {item?.day?.avgtemp_c}&#176;
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                            ) : null
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
        </ImageBackground>
    )
}
