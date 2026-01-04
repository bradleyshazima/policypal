import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ClientsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'RemindersTab') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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