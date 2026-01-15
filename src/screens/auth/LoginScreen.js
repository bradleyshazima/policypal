import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import { Octicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const navigation = useNavigation();
  const { login } = useAuth();

  const emailValid = email.includes('@') && email.includes('.');

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter both email and password'
      });
      setShowAlert(true);
      return;
    }

    if (!emailValid) {
      setAlertConfig({
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please enter a valid email address'
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    const result = await login(email.toLowerCase(), password);
    setLoading(false);

    if (!result.success) {
      setAlertConfig({
        type: 'danger',
        title: 'Login Failed',
        message: result.error || 'Invalid email or password'
      });
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
          keyboardType="email-address"
          autoCapitalize="none"
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
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{color:COLORS.blue, fontFamily:'Regular', fontSize:SIZES.small}}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Login"
        disabled={!email || !password || !emailValid}
        onPress={handleLogin}
        loading={loading}
      />

      <TouchableOpacity style={{marginTop:20}} onPress={() => navigation.navigate('SignUp')}>
        <Text style={{color:COLORS.gray, fontFamily:'Regular', fontSize:SIZES.small}}>
          Don't have an account? <Text style={{color:COLORS.blue, fontFamily:'Medium'}}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="OK"
        onConfirm={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 32,
    backgroundColor:COLORS.white,
  },
});