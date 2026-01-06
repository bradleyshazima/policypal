import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

import ClientsListScreen from '../../screens/main/ClientsListScreen';
import AddClientScreen from '../../screens/client/AddClientScreen';
import EditClientScreen from '../../screens/client/EditClientScreen';
import ClientDetailScreen from '../../screens/client/ClientDetailScreen';

const Stack = createNativeStackNavigator();

const ClientsStackNavigator = () => {
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
        name="ClientsList" 
        component={ClientsListScreen}
        options={{ 
          headerTitle: 'Clients',
        }}
      />
      <Stack.Screen 
        name="AddClient" 
        component={AddClientScreen}
        options={({ navigation }) => ({
          headerTitle: 'Add New Client',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="EditClient" 
        component={EditClientScreen}
        options={({ navigation }) => ({
          headerTitle: 'Edit Client',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" size={24} color={COLORS.blue} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ClientDetail" 
        component={ClientDetailScreen}
        options={({ navigation }) => ({
          headerTitle: 'Client Details',
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

export default ClientsStackNavigator;