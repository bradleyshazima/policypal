import React from 'react'
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity,} from 'react-native'
import { COLORS, SIZES } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';


export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.main}>
      <Image source={require('../../assets/applogo.png')} style={styles.img} />
      <Text style={styles.headerTxt}>Welcome to Policy Pal</Text>
      <Text style={styles.paragraph}>Automate all your clients' insurance payment reminders. Set date, schedule reminder, and wait.</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={[styles.btn, { borderWidth: 2, borderColor:COLORS.black }]}
      >
        <Text style={[styles.btntxt, {color:COLORS.black}]}>
          Log In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={[styles.btn, { backgroundColor: COLORS.blue }]}
      >
        <Text style={[styles.btntxt, {color:COLORS.white}]}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    backgroundColor: COLORS.lightGray,
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  img: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  headerTxt: {
    fontSize: SIZES.xlarge,
    color: COLORS.black,
    fontFamily: "Bold",
    marginBottom: 12,
  },
  paragraph: {
    width: '100%',
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    textAlign: 'center',
    marginBottom: 80,
  },
  btn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  btntxt: {
    fontFamily: 'Medium'
  }
});