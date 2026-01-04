import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

import RemindersScreen from '../../screens/main/RemindersScreen';
import SendReminderScreen from '../../screens/client/SendReminderScreen';

const Stack = createNativeStackNavigator();

const RemindersStackNavigator = () => {
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
              <Ionicons name="arrow-back" size={24} color={COLORS.white} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default RemindersStackNavigator;