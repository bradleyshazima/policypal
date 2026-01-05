import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import CheckBox from '@react-native-community/checkbox';
import { Octicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


export default function SignupScreen({ setIsAuthenticated }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agency, setAgency] = useState('');
  const [password, setPassword] = useState('');
  const emailValid = email.includes('@') && email.includes('.');
  const [checked, setChecked] = useState(false);
  const loading = useState(false)
  const navigation = useNavigation();

    const handleSignUp = () => {
      console.log('Signed up')
      setIsAuthenticated(true);
    };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.main}>
      <Image source={require('../../assets/applogo.png')} style={{width: 80, height: 80, marginBottom:40}} />
      <Text style={{color:COLORS.black, fontSize:SIZES.xlarge, fontFamily:"Bold", width: '100%'}}>Sign Up</Text>
      <View style={{ width: '100%', marginTop: 20 }}>
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <Input
          label="Email"
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          error={!emailValid && email ? 'Invalid email address' : null}
        />
        <Input
          label="Phone number"
          placeholder="Enter phone number"
          value={phone}
          onChangeText={setPhone}
          error={!emailValid && email ? 'Invalid email address' : null}
        />
        <Input
          label="Business/Agency Name"
          placeholder="Enter agency name"
          value={agency}
          onChangeText={setAgency}
        />

      <Input
        label="Password"
        placeholder="Enter your password"
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
          <TouchableOpacity>
          <Text style={styles.label}>I accept the terms & conditions</Text>
          </TouchableOpacity>
        </View>

      </View>

      <Button
        title="Create Account"
        disabled={!email || !password || !emailValid || !checked}
        onPress={handleSignUp}
      />

      <TouchableOpacity style={{marginTop:20}}>
        <Text style={{color:COLORS.blue, fontFamily:'Regular', fontSize:SIZES.small}}>Already have account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
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
})