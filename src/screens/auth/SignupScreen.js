import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  FlatList, 
  TouchableWithoutFeedback,
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import { Octicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';

const COUNTRIES = [
  { name: 'Kenya', code: '+254' },
  { name: 'Uganda', code: '+256' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Somalia', code: '+252' },
];

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Phone State
  const [phoneCode, setPhoneCode] = useState('+254');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [businessName, setBusinessName] = useState('');
  
  // Password State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const { register } = useAuth();

  // --- Validations ---
  const emailValid = email.includes('@') && email.includes('.');

  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !phoneNumber || !password) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all required fields'
      });
      setShowAlert(true);
      return;
    }

    if (!validatePassword(password)) {
      setAlertConfig({
        type: 'warning',
        title: 'Weak Password',
        message: 'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.'
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);
    
    // Format phone: remove '+' and leading '0'
    const cleanCode = phoneCode.replace('+', '');
    const cleanNum = phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber;
    const finalPhone = `${cleanCode}${cleanNum}`;

    const result = await register({
      fullName,
      email: email.toLowerCase(),
      phone: finalPhone,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
          <Image source={require('../../assets/applogo.png')} style={styles.logo} />
          <Text style={styles.title}>Sign Up</Text>
          
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

            {/* --- Phone Input with Country Code --- */}
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={styles.phoneRow}>
              <TouchableOpacity 
                style={styles.countryPicker}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.pickerText}>{phoneCode}</Text>
                <Octicons name="chevron-down" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <Input 
                containerStyle={styles.phoneInputContainer}
                value={phoneNumber} 
                onChangeText={setPhoneNumber}
                placeholder="7XX XXX XXX"
                keyboardType="number-pad"
              />
            </View>

            <Input
              label="Business/Agency Name (Optional)"
              placeholder="Enter agency name"
              value={businessName}
              onChangeText={setBusinessName}
            />

            {/* --- Password with Visibility Toggle & OS Suggestions --- */}
            <View style={{ position: 'relative' }}>
              <Input
                label="Password *"
                placeholder="Strong password required"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                // OS Password Suggestion Logic:
                textContentType="newPassword" 
                passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: special;"
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Octicons 
                  name={showPassword ? "eye" : "eye-closed"} 
                  size={20} 
                  color={COLORS.gray} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Password Hint */}
            <Text style={styles.hintText}>
              Min 8 chars, 1 uppercase, 1 number, 1 special character.
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, checked && styles.checked]}
              onPress={() => setChecked(!checked)}
            >
              {checked && <Octicons name="check" size={10} color="white" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChecked(!checked)}>
              <Text style={styles.label}>I accept the terms & conditions</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Create Account"
            disabled={!email || !password || !emailValid || !checked || !fullName || !phoneNumber}
            onPress={handleSignUp}
            loading={loading}
          />

          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Already have account? <Text style={{ color: COLORS.blue, fontFamily: 'Medium' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* --- Country Selection Modal --- */}
        <Modal visible={isModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Country</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Octicons name="x" size={24} color={COLORS.black} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={COUNTRIES}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.modalItem} 
                      onPress={() => {
                        setPhoneCode(item.code);
                        setIsModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name} ({item.code})</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Alert
          visible={showAlert}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          confirmText="OK"
          onConfirm={() => setShowAlert(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { color: COLORS.black, fontSize: SIZES.xlarge, fontFamily: "Bold", width: '100%' },
  inputLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 6,
    marginLeft: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countryPicker: {
    width: '30%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray + '40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 0,
  },
  phoneInputContainer: { width: '68%', marginBottom: 0 },
  pickerText: { fontFamily: 'Regular', fontSize: SIZES.medium, color: COLORS.black },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 40, // Adjust based on your Input label height
  },
  hintText: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, width: '100%' },
  checkbox: { width: 18, height: 18, borderWidth: 2, borderColor: COLORS.gray, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checked: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  label: { fontFamily: 'Regular', fontSize: SIZES.small, color: COLORS.black },
  footerText: { color: COLORS.gray, fontFamily: 'Regular', fontSize: SIZES.small },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontFamily: 'Bold', fontSize: SIZES.large },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: SIZES.medium, fontFamily: 'Regular' },
});