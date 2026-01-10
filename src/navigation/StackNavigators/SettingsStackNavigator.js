import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

import SettingsScreen from '../../screens/main/SettingsScreen';
import ProfileScreen from '../../screens/settings/ProfileScreen';
import SubscriptionScreen from '../../screens/settings/SubscriptionScreen';
import MessageTemplatesScreen from '../../screens/settings/MessageTemplatesScreen';
import AboutAppScreen from '../../screens/settings/AboutAppScreen';
import TermsScreen from '../../screens/settings/TermsScreen';
import PrivacyPolicyScreen from '../../screens/settings/PrivacyPolicyScreen';
import PaymentHistoryScreen from '../../screens/settings/PaymentHistoryScreen';
import BillingInfoScreen from '../../screens/settings/BillingInfoScreen';
import ChangePasswordScreen from '../../screens/settings/ChangePasswordScreen';
import ContactSupportScreen from '../../screens/settings/ContactSupportScreen';
import FAQsScreen from '../../screens/settings/FAQsScreen';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator
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
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
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
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
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
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="AboutApp" 
        component={AboutAppScreen}
        options={({ navigation }) => ({
          headerTitle: 'About',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="BillingInfo" 
        component={BillingInfoScreen}
        options={({ navigation }) => ({
          headerTitle: 'Billing Information',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={({ navigation }) => ({
          headerTitle: 'Change Password',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ContactSupport" 
        component={ContactSupportScreen}
        options={({ navigation }) => ({
          headerTitle: 'Contact Support',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="FAQs" 
        component={FAQsScreen}
        options={({ navigation }) => ({
          headerTitle: 'FAQs',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="PaymentHistory" 
        component={PaymentHistoryScreen}
        options={({ navigation }) => ({
          headerTitle: 'Payment History',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
        options={({ navigation }) => ({
          headerTitle: 'Privacy Policy',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Terms" 
        component={TermsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Terms of Service',
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

export default SettingsStackNavigator;