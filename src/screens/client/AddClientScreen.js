import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Octicons } from '@expo/vector-icons';

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
  const [currency, setCurrency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('');

  /* ========================
     Reminder Settings
  ======================== */
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleSave = () => {
    console.log('Client saved');
    navigation.goBack();
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
          <UploadBox label="Profile photo (optional)" />

          <Input label="Full name *" value={fullName} onChangeText={setFullName} />
          <Input label="Phone number *" value={phone} onChangeText={setPhone} />
          <Input label="Email address" value={email} onChangeText={setEmail} />
          <Input
            label="Physical address"
            value={address}
            onChangeText={setAddress}
          />
          <Input
            label="ID / License number"
            value={idNumber}
            onChangeText={setIdNumber}
          />
        </Section>

        {/* ========================
           Vehicle Information
        ======================== */}
        <Section title="Vehicle Information">
          <Input label="Car make *" value={make} onChangeText={setMake} />
          <Input label="Car model *" value={model} onChangeText={setModel} />
          <Input
            label="Year of manufacture"
            value={year}
            onChangeText={setYear}
          />
          <Input
            label="Registration / Plate number"
            value={plate}
            onChangeText={setPlate}
          />
          <Input label="VIN number" value={vin} onChangeText={setVin} />
          <Input label="Car color" value={color} onChangeText={setColor} />
        </Section>

        {/* ========================
           Insurance Details
        ======================== */}
        <Section title="Insurance Details">
          <Input
            label="Insurance type *"
            value={insuranceType}
            onChangeText={setInsuranceType}
          />
          <Input
            label="Insurance company"
            value={company}
            onChangeText={setCompany}
          />
          <Input
            label="Policy number"
            value={policyNumber}
            onChangeText={setPolicyNumber}
          />
          <Input
            label="Coverage amount / Premium *"
            value={premium}
            onChangeText={setPremium}
          />
          <Input
            label="Currency"
            value={currency}
            onChangeText={setCurrency}
          />
          <Input
            label="Start date *"
            value={startDate}
            onChangeText={setStartDate}
          />
          <Input
            label="Renewal / Expiry date *"
            value={expiryDate}
            onChangeText={setExpiryDate}
          />
          <Input
            label="Payment frequency"
            value={paymentFrequency}
            onChangeText={setPaymentFrequency}
          />
        </Section>

        {/* ========================
           Documents
        ======================== */}
        <Section title="Documents">
          <UploadBox label="Upload insurance certificate" />
          <UploadBox label="Upload car photos" />
          <UploadBox label="Upload ID copy" />
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

          <Input
            label="Custom message template (optional)"
            multiline
            numberOfLines={4}
          />
        </Section>

        {/* ========================
           Buttons
        ======================== */}
        <View style={{ marginTop: 24 }}>
          <Button title="Save Client" onPress={handleSave} />
          <Button title="Cancel" variant='danger' onPress={() => navigation.goBack()} />
        </View>
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
   Upload Placeholder
======================== */
const UploadBox = ({ label }) => (
  <TouchableOpacity style={styles.uploadBox}>
    <Octicons name="upload" size={18} color={COLORS.blue} />
    <Text style={styles.uploadText}>{label}</Text>
  </TouchableOpacity>
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
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 12,
  },
  uploadText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
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
  cancelText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.blue,
    textDecorationLine: 'underline',
  },
});
