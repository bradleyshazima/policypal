import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

import RemindersScreen from '../../screens/main/RemindersScreen';
import SendReminderScreen from '../../screens/reminder/SendReminderScreen';

const Stack = createNativeStackNavigator();

const RemindersStackNavigator = () => {
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
        name="RemindersList" 
        component={RemindersScreen}
        options={{ 
          headerTitle: 'Reminders',
        }}
      />
      <Stack.Screen 
        name="SendReminder" 
        component={SendReminderScreen}
        options={({ navigation }) => ({
          headerTitle: 'Send Manual Reminder',
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

export default RemindersStackNavigator;