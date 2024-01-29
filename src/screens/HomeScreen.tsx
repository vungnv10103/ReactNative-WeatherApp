import { View, Text } from 'react-native'
import React, { useEffect } from 'react'



export default function HomeScreen() {
    const demo = () => {
        console.log("hello");
    }
    useEffect(() => {
        // demo();
    }, [])


    return (
        <View className="bg-black flex-1 justify-center items-center">
            <Text className='text-white text-xl' style={{ fontFamily: 'Inter-Bold' }}>HomeScreen</Text>
        </View>
    )
}
