import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    Bold: require('./assets/fonts/LufgaBold.ttf'),
    SemiBold: require('./assets/fonts/LufgaSemiBold.ttf'),
    Medium: require('./assets/fonts/LufgaMedium.ttf'),
    Regular: require('./assets/fonts/LufgaRegular.ttf'),
    Light: require('./assets/fonts/LufgaLight.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}