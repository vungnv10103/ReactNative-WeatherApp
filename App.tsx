import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import Navigation from './src/screens/Navigation'


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Navigation'>
        <Stack.Screen name="Navigation" component={Navigation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
