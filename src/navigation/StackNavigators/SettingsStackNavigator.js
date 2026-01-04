import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

import SettingsScreen from '../../screens/main/SettingsScreen';
import ProfileScreen from '../../screens/settings/ProfileScreen';
import SubscriptionScreen from '../../screens/settings/SubscriptionScreen';
import MessageTemplatesScreen from '../../screens/settings/MessageTemplatesScreen';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="SettingsList" 
        component={SettingsScreen}
        options={{ 
          headerTitle: 'Settings',
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: 'Profile',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={({ navigation }) => ({
          headerTitle: 'Subscription Plans',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="MessageTemplates" 
        component={MessageTemplatesScreen}
        options={({ navigation }) => ({
          headerTitle: 'Message Templates',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;