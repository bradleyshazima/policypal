import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Import Stack Navigators for each tab
import HomeStackNavigator from './StackNavigators/HomeStackNavigator';
import ClientsStackNavigator from './StackNavigators/ClientsStackNavigator';
import RemindersStackNavigator from './StackNavigators/RemindersStackNavigator';
import SettingsStackNavigator from './StackNavigators/SettingsStackNavigator';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide default header (we'll use stack headers)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home-fill' : 'home';
          } else if (route.name === 'ClientsTab') {
            iconName = focused ? 'people' : 'people';
          } else if (route.name === 'RemindersTab') {
            iconName = focused ? 'clock-fill' : 'clock';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'gear' : 'gear';
          }

          return <Octicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 8,
          height: 72,
          backgroundColor:COLORS.lightGray,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Medium'
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="ClientsTab" 
        component={ClientsStackNavigator}
        options={{ tabBarLabel: 'Clients' }}
      />
      <Tab.Screen 
        name="RemindersTab" 
        component={RemindersStackNavigator}
        options={{ tabBarLabel: 'Reminders' }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStackNavigator}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;