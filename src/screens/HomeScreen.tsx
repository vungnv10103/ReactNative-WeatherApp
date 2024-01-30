import { View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { theme } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { apiKeyGoogle, apiKeyOpenCage } from '../constants';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Animated, {
    FadeIn,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const forecastDay = 7;
const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

import { fetchLocation, fetchWeatherForecast } from '../service/api.weather';

import { ILocation, IWeather, IForecastDay } from '../interface/_index'
import { convertENtoVi, formatTemperature, getImageSource, removeVietnameseAccent } from '../utils';

export default function HomeScreen() {
    const sv = useSharedValue(0);

    const [showSearch, toggleSearch] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [locations, setLocations] = useState<ILocation[]>([]);
    const [weather, setWeather] = useState<IWeather | null>(null);
    const { current, location } = weather || {};
    const forecastLength = weather?.forecast?.forecastday?.length || 0;
    const imageWeatherClass = current?.condition.text.trim() == "Fog" ? " ml-10" : "";

    const handleLocation = async (location: ILocation): Promise<void> => {
        setLoading(true);
        // console.log(location);
        let dataLocation = JSON.stringify(location);
        await AsyncStorage.setItem('location', dataLocation);
        setLocations([]);
        toggleSearch(false);
        fetchWeatherForecast({
            cityName: location.name,
            days: forecastDay
        }).then(data => {
            // console.log(data);
            setLoading(false);
            setWeather(data);
        });
    };

    const handleSearch = (value: string) => {
        if (value.length < 2) return;
        fetchLocation({
            cityName: value
        }).then(data => {
            setLocations(data);
        });
    };

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

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
                    .then((responseJson) => {
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
                                handleLocation(location);
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
        if (previusLocation != null) {
            let location: ILocation = JSON.parse(previusLocation);
            handleLocation(location);
        }
        else {
            await getCurrentLocation();
        }
    }


    useEffect(() => {
        if (isLoading) {
            sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
        }
        getWeatherPrevious();
    }, []);


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    return (
        <ImageBackground
            source={require('../assets/images/bg.png')}
            blurRadius={80}
            className='h-full w-full'>
            {
                !isLoading ? (<ScrollView
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
                        <View className='mx-4 flex flex-1'>
                            {/* location */}
                            <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-center pt-6 text-3xl'>
                                {location?.name != undefined ? location?.name + ", " : ""}
                                <Text style={{ fontFamily: "Inter-Medium" }} className='text-xl text-gray-300'>
                                    {location?.country}
                                </Text>
                            </Text>
                            {/* weather image */}
                            <View className={'flex-row justify-center mt-3' + imageWeatherClass}>
                                <Image
                                    className='w-52 h-52'
                                    source={getImageSource(current?.condition.text || 'default')}
                                // source={{uri: `https:${current?.condition?.icon}`}}
                                />
                            </View>
                            {/* degree celcius */}
                            <View className='space-y-2 mt-4'>
                                <Text style={{ fontFamily: "Inter-Bold" }} className='text-center text-white text-6xl ml-5'>
                                    {formatTemperature(current?.temp_c || "default")}
                                </Text>
                                <Text style={{ fontFamily: "Inter-Bold" }} className='text-center text-white text-xl tracking-widest'>
                                    {convertENtoVi(current?.condition?.text || "")}
                                </Text>
                            </View>

                            {/* other status */}
                            {
                                current && <View className='flex-row justify-between mt-4 mx-1.5'>
                                    <View className='flex-row space-x-2 items-center'>
                                        <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/wind_1.png')} />
                                        <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                            {current?.wind_kph || 0.0} km/h
                                        </Text>
                                    </View>
                                    <View className='flex-row space-x-2 items-center'>
                                        <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/drop.png')} />
                                        <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                            {current?.humidity || 0.0} &#37;
                                        </Text>
                                    </View>
                                    <View className='flex-row space-x-2 items-center'>
                                        <Image style={{ tintColor: '#ffffff' }} className='w-6 h-6' source={require('../assets/images/sun.png')} />
                                        <Text style={{ fontFamily: "Inter-Medium" }} className='text-white text-base'>
                                            {weather?.forecast.forecastday[0].astro.sunrise}
                                        </Text>
                                    </View>
                                </View>
                            }

                        </View>

                        {/* forecast for nextday */}
                        {forecastLength > 0 ? (
                            <View className='mt-5 mb-2 space-y-3'>
                                <View className='flex-row items-center mx-5 mt-4 space-x-2'>
                                    <Ionicons name={'calendar-outline'} color={'white'} size={22} />
                                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-base'>Daily forecast</Text>
                                </View>
                                {
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
                                    >
                                        {
                                            weather?.forecast?.forecastday.map((item: IForecastDay, index: number) => {
                                                // console.log(item?.day?.condition?.text);
                                                let date = new Date(item.date);
                                                let options: Intl.DateTimeFormatOptions = { weekday: 'long' };
                                                let dayName = date.toLocaleDateString('en-US', options);
                                                dayName = dayName.split(',')[0];

                                                return (
                                                    <TouchableOpacity key={index} style={{ backgroundColor: theme.bgWhite(0.15) }}
                                                        className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'>
                                                        <Image
                                                            className='h-11 w-11'
                                                            source={getImageSource(item?.day?.condition?.text)}
                                                        // source={require('../assets/images/heavyrain.png')}
                                                        />
                                                        <Text style={{ fontFamily: "Inter-Medium" }} className='text-white'>
                                                            {dayName}
                                                        </Text>
                                                        <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-xl'>
                                                            {item?.day?.avgtemp_c}&#176;
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                }
                            </View>
                        ) : null}
                        <View className='h-24'></View>
                    </SafeAreaView>
                </ScrollView>
                ) : (
                    <View className='flex-1 justify-center items-center h-full'>
                        <Animated.View className='h-16 w-16 bg-sky-400 rounded-2xl' style={[animatedStyle]}>

                        </Animated.View>
                    </View>
                )
            }
        </ImageBackground>
    )
}
