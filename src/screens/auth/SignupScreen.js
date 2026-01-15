import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import { Octicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const navigation = useNavigation();
  const { register } = useAuth();

  const emailValid = email.includes('@') && email.includes('.');

  const handleSignUp = async () => {
    if (!fullName || !email || !phone || !password) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all required fields'
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

    if (password.length < 6) {
      setAlertConfig({
        type: 'warning',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long'
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    const result = await register({
      fullName,
      email: email.toLowerCase(),
      phone,
      businessName: businessName || fullName + "'s Agency",
      password
    });
    setLoading(false);

    if (result.success) {
      setAlertConfig({
        type: 'success',
        title: 'Account Created!',
        message: 'Your 7-day free trial has started. Welcome to PolicyPal!'
      });
      setShowAlert(true);
      // Navigation will happen automatically via AuthContext
    } else {
      setAlertConfig({
        type: 'danger',
        title: 'Registration Failed',
        message: result.error || 'Could not create account. Please try again.'
      });
      setShowAlert(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.main}>
        <Image source={require('../../assets/applogo.png')} style={{width: 80, height: 80, marginBottom:40}} />
        <Text style={{color:COLORS.black, fontSize:SIZES.xlarge, fontFamily:"Bold", width: '100%'}}>Sign Up</Text>
        <View style={{ width: '100%', marginTop: 20 }}>
          <Input
            label="Full Name *"
            placeholder="Enter full name"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label="Email *"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            error={!emailValid && email ? 'Invalid email address' : null}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Phone Number *"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="Business/Agency Name (Optional)"
            placeholder="Enter agency name"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <Input
            label="Password *"
            placeholder="Enter your password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={{width:'100%',display: 'flex',flexDirection:'column',alignItems:'center', justifyContent:'space-between'}}>
          <View style={styles.container}>
            <TouchableOpacity
              style={[styles.checkbox, checked && styles.checked]}
              onPress={() => setChecked(!checked)}
              activeOpacity={0.8}
            >
              {checked && <Octicons name="check" size={10} color="white" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChecked(!checked)}>
              <Text style={styles.label}>I accept the terms & conditions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Create Account"
          disabled={!email || !password || !emailValid || !checked || !fullName || !phone}
          onPress={handleSignUp}
          loading={loading}
        />

        <TouchableOpacity style={{marginTop:20}} onPress={() => navigation.navigate('Login')}>
          <Text style={{color:COLORS.gray, fontFamily:'Regular', fontSize:SIZES.small}}>
            Already have account? <Text style={{color:COLORS.blue, fontFamily:'Medium'}}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
    display: 'flex',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 32,
    backgroundColor:COLORS.lightGray,
    paddingBottom: 80,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%'
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
    color: COLORS.blue,
    textDecorationLine: 'underline',
  },
});