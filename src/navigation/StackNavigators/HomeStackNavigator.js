import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';

import DashboardScreen from '../../screens/main/DashboardScreen';
import ReportsScreen from '../../screens/main/ReportsScreen';
import NotificationsScreen from '../../screens/main/NotificationsScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      headerShown={false}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.lightGray,
        },
        headerTintColor: COLORS.blue,
        headerTitleStyle: {
          fontFamily: 'Bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          headerTitle: 'Dashboard',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Reports & Analytics',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;