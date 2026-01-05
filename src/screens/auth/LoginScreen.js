import { View, Text, Image, StyleSheet, TouchableOpacity, Easing } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import SignupScreen from './SignupScreen';
import Input from '../../components/common/Input';
import CheckBox from '@react-native-community/checkbox';
import { Octicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import Alert from '../../components/common/Alert';


export default function LoginScreen({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailValid = email.includes('@') && email.includes('.');
  const [checked, setChecked] = useState(false);
  const loading = useState(false)
  const navigation = useNavigation();

  const [showAlert, setShowAlert] = useState(false);

    const handleLogin = () => {
      const demoUser = {
        email: 'brad@policy.com',
        password: 'adminpass',
      };

      if (email === demoUser.email && password === demoUser.password) {
        setIsAuthenticated(true);
      } else {
        setShowAlert(true);
      }
    };


  return (
    <SafeAreaView style={styles.main}>
      <Image source={require('../../assets/applogo.png')} style={{width: 80, height: 80, marginBottom:40}} />
      <Text style={{color:COLORS.black, fontSize:SIZES.xlarge, fontFamily:"Bold", width: '100%'}}>Login</Text>
      <View style={{ width: '100%', marginTop: 20 }}>
        <Input
          label="Email"
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          error={!emailValid && email ? 'Invalid email address' : null}
        />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      </View>
      <View style={{width:'100%',display: 'flex',flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.checkbox, checked && styles.checked]}
            onPress={() => setChecked(!checked)}
            activeOpacity={0.8}
          >
            {checked && <Octicons name="check" size={10} color="white" />}
          </TouchableOpacity>
          <Text style={styles.label}>Remember me</Text>
        </View>
        <TouchableOpacity>
          <Text style={{color:COLORS.blue, fontFamily:'Regular', fontSize:SIZES.small}}>Forgot password</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Login"
        disabled={!email || !password || !emailValid}
        onPress={handleLogin}
      />

      <Alert
        visible={showAlert}
        title="Login Failed"
        message="Invalid email address or password"
        confirmText="Try Again"
        duration={200}
        easing={Easing.out(Easing.cubic)}
        slideDistance={60}
        onConfirm={() => setShowAlert(false)}
      />
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
  main: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 32,
    backgroundColor:COLORS.white,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    width: '50%'
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  label: {
    marginLeft: 8,
    fontSize: SIZES.small,
    fontFamily: 'Regular',
    color: COLORS.black,
  },
})