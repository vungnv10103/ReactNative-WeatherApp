import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeScreen, NotificationScreen, SettingScreen } from './_index'
const Tab = createMaterialBottomTabNavigator();

const TabArr = [
    { route: 'Home', label: 'Home', showCustomHeader: true, activeIcon: 'home', inActiveIcon: 'home-outline', component: HomeScreen, tabBarColor: "#fbbf24" },
    { route: 'Notification', label: 'Notification', showCustomHeader: true, activeIcon: 'notifications', inActiveIcon: 'notifications-outline', component: NotificationScreen, tabBarColor: "#FF0000" },
    { route: 'Setting', label: 'Setting', showCustomHeader: true, activeIcon: 'settings', inActiveIcon: 'settings-outline', component: SettingScreen, tabBarColor: "#00FF00" },
];

export default function Navigation() {
    return (
        <Tab.Navigator initialRouteName='Home'
            onTabLongPress={(item) => console.log(item.route.title)}
            screenOptions={{

            }}
            shifting={true}
            activeColor="#5a3938"
            barStyle={{ backgroundColor: '#ffeae9' }}
        >
            {TabArr.map((tab) => (
                <Tab.Screen
                    key={tab.route}
                    name={tab.route}
                    component={tab.component}
                    options={{
                        tabBarLabel: tab.label,
                        tabBarBadge: tab.label === "Notification" ? 3 : undefined,
                        tabBarIcon: ({ focused, color }) => (
                            <Ionicons name={focused ? tab.activeIcon : tab.inActiveIcon} color={color} size={26} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}