import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import Navigation from './src/screens/Navigation'
import { LoginScreen, HomeScreen } from './src/screens/_index';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Navigation" component={Navigation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
