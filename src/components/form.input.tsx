import { View, Text, StatusBar, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

import ImagePicker from 'react-native-image-crop-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';


export default function FormInput(props: any) {

    const [selectedImage, setSelectedImage] = useState({
        uri: ''
    });
    const [apiWeather, setApiWeather] = useState('')
    const [apiGoogle, setApiGoogle] = useState('')
    const [apiLocation, setApiLocation] = useState('')
    const [img, setImage] = useState('')
    const [loading, isLoading] = useState(false)
    const [progress, setProgress] = useState(0);

    const handleClose = () => { props.navigation.goBack() }

    const handleSubmit = async () => {

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


    return (
        <View>
            {props.visible ? (<View className="flex-1 bg-gray-100">
                <StatusBar barStyle="light-content" />
                <View className='flex-row items-center my-3'>
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        className="p-2 rounded-full ml-5 bg-gray-100">
                        {/* <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#2dd4c0" /> */}
                    </TouchableOpacity>

                    <Text style={{ fontFamily: 'Inter-Bold' }}
                        className='text-black text-xl mx-4'>
                        Form
                    </Text>
                </View>

                <ScrollView
                    className="space-y-1 pt-2 mx-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                >
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2">API Weather</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={apiWeather}
                        onChangeText={(text) => setApiWeather(text)}
                    />

                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2">API Google</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={apiGoogle}
                        onChangeText={(text) => setApiGoogle(text)}
                    />

                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2">API Location</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
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
            </View>) : (<View>
                <Text style={{ fontFamily: 'Inter-Bold' }}
                    className='text-black text-xl mx-4'>
                    Form
                </Text>
            </View>)}
        </View>
    )
}
