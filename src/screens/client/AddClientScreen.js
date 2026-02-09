import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Octicons } from '@expo/vector-icons';
import Alert from '../../components/common/Alert';
import api from '../../services/api';

export default function AddClientScreen({ navigation }) {
  /* ========================
     Personal Info
  ======================== */
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [idNumber, setIdNumber] = useState('');

  /* ========================
     Vehicle Info
  ======================== */
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');

  /* ========================
     Insurance Info
  ======================== */
  const [insuranceType, setInsuranceType] = useState('');
  const [company, setCompany] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [premium, setPremium] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('');

  /* ========================
     Reminder Settings
  ======================== */
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  /* ========================
     UI State
  ======================== */
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const validateForm = () => {
    if (!fullName.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter client full name',
      });
      setShowAlert(true);
      return false;
    }

    if (!phone.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter client phone number',
      });
      setShowAlert(true);
      return false;
    }

    if (!make.trim() || !model.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter vehicle make and model',
      });
      setShowAlert(true);
      return false;
    }

    if (!insuranceType.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter insurance type',
      });
      setShowAlert(true);
      return false;
    }

    if (!expiryDate.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please enter policy expiry date',
      });
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const clientData = {
        full_name: fullName,
        phone: phone,
        alt_phone: altPhone || null,
        email: email || null,
        address: address || null,
        id_number: idNumber || null,
        car_make: make,
        car_model: model,
        car_year: year || null,
        plate_number: plate || null,
        vin_number: vin || null,
        car_color: color || null,
        insurance_type: insuranceType,
        insurance_company: company || null,
        policy_number: policyNumber || null,
        coverage_amount: premium || null,
        currency: currency,
        start_date: startDate || null,
        expiry_date: expiryDate,
        payment_frequency: paymentFrequency || null,
        reminders_enabled: remindersEnabled,
        custom_message: customMessage || null,
        status: 'active',
      };

      await api.clients.create(clientData);

      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Client added successfully!',
      });
      setShowAlert(true);

      // Navigate back after showing success message
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Create client error:', error);
      
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to add client. Please try again.',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.main}
      showsVerticalScrollIndicator={false}
    >
      {/* ========================
         Personal Information
      ======================== */}
      <Section title="Personal Information">
        <Input 
          label="Full name *" 
          value={fullName} 
          onChangeText={setFullName}
          placeholder="Enter full name"
        />
        <Input 
          label="Phone number *" 
          value={phone} 
          onChangeText={setPhone}
          placeholder="+254..."
          keyboardType="phone-pad"
        />
        <Input 
          label="Alternative phone" 
          value={altPhone} 
          onChangeText={setAltPhone}
          placeholder="+254..."
          keyboardType="phone-pad"
        />
        <Input 
          label="Email address" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
          placeholder="email@example.com"
        />
        <Input
          label="Physical address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />
        <Input
          label="ID / License number"
          value={idNumber}
          onChangeText={setIdNumber}
          placeholder="Enter ID or license number"
        />
      </Section>

      {/* ========================
         Vehicle Information
      ======================== */}
      <Section title="Vehicle Information">
        <Input 
          label="Car make *" 
          value={make} 
          onChangeText={setMake}
          placeholder="e.g., Toyota"
        />
        <Input 
          label="Car model *" 
          value={model} 
          onChangeText={setModel}
          placeholder="e.g., Corolla"
        />
        <Input
          label="Year of manufacture"
          value={year}
          onChangeText={setYear}
          placeholder="YYYY"
          keyboardType="number-pad"
        />
        <Input
          label="Registration / Plate number"
          value={plate}
          onChangeText={setPlate}
          placeholder="e.g., KAA 123A"
        />
        <Input 
          label="VIN number" 
          value={vin} 
          onChangeText={setVin}
          placeholder="17-character VIN"
        />
        <Input 
          label="Car color" 
          value={color} 
          onChangeText={setColor}
          placeholder="e.g., White"
        />
      </Section>

      {/* ========================
         Insurance Details
      ======================== */}
      <Section title="Insurance Details">
        <Input
          label="Insurance type *"
          value={insuranceType}
          onChangeText={setInsuranceType}
          placeholder="e.g., Comprehensive"
        />
        <Input
          label="Insurance company"
          value={company}
          onChangeText={setCompany}
          placeholder="e.g., Jubilee Insurance"
        />
        <Input
          label="Policy number"
          value={policyNumber}
          onChangeText={setPolicyNumber}
          placeholder="Enter policy number"
        />
        <Input
          label="Premium amount"
          value={premium}
          onChangeText={setPremium}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
        <Input
          label="Currency"
          value={currency}
          onChangeText={setCurrency}
          placeholder="KES"
        />
        <Input
          label="Start date"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
        />
        <Input
          label="Renewal / Expiry date *"
          value={expiryDate}
          onChangeText={setExpiryDate}
          placeholder="YYYY-MM-DD"
        />
        <Input
          label="Payment frequency"
          value={paymentFrequency}
          onChangeText={setPaymentFrequency}
          placeholder="e.g., Annual, Monthly"
        />
      </Section>

      {/* ========================
         Reminder Settings
      ======================== */}
      <Section title="Reminder Settings">
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setRemindersEnabled(!remindersEnabled)}
        >
          <Text style={styles.toggleLabel}>Enable reminders</Text>
          <Octicons
            name={remindersEnabled ? 'check-circle' : 'circle'}
            size={20}
            color={remindersEnabled ? COLORS.success : COLORS.gray}
          />
        </TouchableOpacity>

        {remindersEnabled && (
          <Input
            label="Custom message template (optional)"
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Enter custom reminder message..."
          />
        )}
      </Section>

      {/* ========================
         Buttons
      ======================== */}
      <View style={{ marginTop: 24 }}>
        <Button 
          title={loading ? "Saving..." : "Save Client"} 
          onPress={handleSave}
          loading={loading}
          disabled={loading}
        />
        <Button 
          title="Cancel" 
          variant='secondary' 
          onPress={() => navigation.goBack()}
          disabled={loading}
        />
      </View>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="OK"
        onConfirm={() => setShowAlert(false)}
      />
    </ScrollView>
  );
}

/* ========================
   Reusable Section Wrapper
======================== */
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

/* ========================
   Styles
======================== */
const styles = StyleSheet.create({
  main: {
    padding: 8,
    backgroundColor: COLORS.primary,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.medium,
    marginBottom: 12,
    color: COLORS.blue,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
});