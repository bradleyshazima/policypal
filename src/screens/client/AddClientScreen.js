import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Octicons } from '@expo/vector-icons';
import Alert from '../../components/common/Alert';
import api from '../../services/api';

// --- Static Data for Dropdowns ---
const COUNTRIES = [
  { name: 'Kenya', code: '+254' },
  { name: 'Uganda', code: '+256' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Somalia', code: '+252' },
];

const INSURANCE_TYPES = ['Comprehensive', 'Third Party'];

const FREQUENCIES = [
  { label: 'Monthly', value: 'Monthly', months: 1 },
  { label: 'Quarterly', value: 'Quarterly', months: 3 },
  { label: 'Half-Yearly', value: 'Half-Yearly', months: 6 },
  { label: 'Yearly', value: 'Yearly', months: 12 },
];

// Generate years for picker (Current year back to 1980)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export default function AddClientScreen({ navigation }) {
  /* ========================
      Personal Info
  ======================== */
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  
  // Phone Logic Split
  const [phoneCode, setPhoneCode] = useState('+254');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [altPhoneCode, setAltPhoneCode] = useState('+254');
  const [altPhoneNumber, setAltPhoneNumber] = useState('');
  
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [idNumber, setIdNumber] = useState('');

  /* ========================
      Vehicle Info
  ======================== */
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(''); // Selected via Picker
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
  // Currency removed from UI, default KES handled in logic
  
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [expiryDate, setExpiryDate] = useState(''); // Auto-calculated
  const [paymentFrequency, setPaymentFrequency] = useState(''); // Holds the object {label, value, months}

  /* ========================
      Reminder Settings
  ======================== */
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  /* ========================
      UI State & Modals
  ======================== */
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  // Modal Visibility States
  const [modalType, setModalType] = useState(null); // 'country', 'altCountry', 'year', 'insurance', 'frequency', 'date'

  // --- Auto-Calculate Expiry ---
  useEffect(() => {
    if (startDate && paymentFrequency) {
      calculateExpiry(startDate, paymentFrequency.months);
    }
  }, [startDate, paymentFrequency]);

  const calculateExpiry = (startStr, monthsToAdd) => {
    // Basic date parsing (Assumes YYYY-MM-DD)
    const dateParts = startStr.split('-');
    if (dateParts.length !== 3) return;
    
    const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    d.setMonth(d.getMonth() + monthsToAdd);
    
    // Format back to YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setExpiryDate(`${y}-${m}-${day}`);
  };

  const handleFullNameChange = (text) => {
    setFullName(text);
    if (text.trim().split(' ').length < 2) {
      setFullNameError('Add a last name');
    } else {
      setFullNameError('');
    }
  };

  const formatPhoneForSave = (code, number) => {
    if (!number) return null;
    // Remove + from code
    const cleanCode = code.replace('+', '');
    // Remove leading 0 from number
    const cleanNumber = number.startsWith('0') ? number.substring(1) : number;
    return `${cleanCode}${cleanNumber}`;
  };

  const validateForm = () => {
    // 1. Name Validation
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setFullNameError('Add a last name');
      setAlertConfig({
        type: 'warning',
        title: 'Invalid Name',
        message: 'Please enter at least two names.',
      });
      setShowAlert(true);
      return false;
    }

    // 2. Phone Validation
    if (!phoneNumber.trim()) {
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

    if (!insuranceType) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select insurance type',
      });
      setShowAlert(true);
      return false;
    }

    if (!startDate || !paymentFrequency) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select start date and payment frequency',
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
      const finalPhone = formatPhoneForSave(phoneCode, phoneNumber);
      const finalAltPhone = formatPhoneForSave(altPhoneCode, altPhoneNumber);

      const clientData = {
        full_name: fullName,
        phone: finalPhone,
        alt_phone: finalAltPhone,
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
        currency: 'KES', // Defaulted
        start_date: startDate || null,
        expiry_date: expiryDate,
        payment_frequency: paymentFrequency.value || null,
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

  // --- Render Custom Date Picker Content ---
  // A simple list of dates for the next 30 days and previous 30 days could be too long.
  // For simplicity without external libs, we will treat the date picker as a manual Text Input 
  // formatted, OR if you strictly want a picker, we use a simple generic Modal.
  // *Reverting to a Manual Date Input approach within a Modal or formatted Text Input is safest 
  // without 'react-native-datetimepicker' installed.*
  // HOWEVER, for this code, I will implement a "Date Selector Modal" that just lists 
  // Year, Month, Day in a simple way to fulfill "Date Picker" requirement using native Views.

  const DatePickerModal = ({ onClose, onSelect }) => {
    const [dYear, setDYear] = useState(currentYear);
    const [dMonth, setDMonth] = useState(new Date().getMonth() + 1);
    const [dDay, setDDay] = useState(new Date().getDate());

    const confirmDate = () => {
      const mStr = String(dMonth).padStart(2, '0');
      const dStr = String(dDay).padStart(2, '0');
      onSelect(`${dYear}-${mStr}-${dStr}`);
      onClose();
    };

    return (
      <View style={styles.datePickerContainer}>
        <Text style={styles.modalTitle}>Select Start Date</Text>
        <View style={styles.dateRow}>
          <Input 
             value={String(dYear)} 
             onChangeText={(t) => setDYear(t)} 
             placeholder="YYYY" 
             keyboardType="numeric"
             containerStyle={{width: 80}}
          />
          <Input 
             value={String(dMonth)} 
             onChangeText={(t) => setDMonth(t)} 
             placeholder="MM" 
             keyboardType="numeric"
             containerStyle={{width: 60}}
          />
          <Input 
             value={String(dDay)} 
             onChangeText={(t) => setDDay(t)} 
             placeholder="DD" 
             keyboardType="numeric"
             containerStyle={{width: 60}}
          />
        </View>
        <Button title="Confirm Date" onPress={confirmDate} style={{marginTop: 10}} />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
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
            onChangeText={handleFullNameChange}
            placeholder="Enter full name"
            error={fullNameError}
          />

          {/* Primary Phone */}
          <Text style={styles.inputLabel}>Phone number *</Text>
          <View style={styles.phoneRow}>
            {/* Country Picker */}
            <TouchableOpacity 
              style={styles.countryPicker}
              onPress={() => setModalType('country')}
            >
              <Text style={styles.pickerText}>{phoneCode}</Text>
              <Octicons name="chevron-down" size={16} color={COLORS.gray} />
            </TouchableOpacity>
            
            {/* Number Input */}
            <Input 
              containerStyle={styles.phoneInputContainer}
              value={phoneNumber} 
              onChangeText={setPhoneNumber}
              placeholder="7XX XXX XXX"
              keyboardType="number-pad"
            />
          </View>

          {/* Alt Phone */}
          <Text style={styles.inputLabel}>Alternative phone</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity 
              style={styles.countryPicker}
              onPress={() => setModalType('altCountry')}
            >
              <Text style={styles.pickerText}>{altPhoneCode}</Text>
              <Octicons name="chevron-down" size={16} color={COLORS.gray} />
            </TouchableOpacity>
            
            <Input 
              containerStyle={styles.phoneInputContainer}
              value={altPhoneNumber} 
              onChangeText={setAltPhoneNumber}
              placeholder="7XX XXX XXX"
              keyboardType="number-pad"
            />
          </View>

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
          
          {/* Year Picker */}
          <Text style={styles.inputLabel}>Year of manufacture</Text>
          <TouchableOpacity 
            style={styles.pickerInput}
            onPress={() => setModalType('year')}
          >
            <Text style={[styles.pickerText, !year && { color: COLORS.gray }]}>
              {year || 'Select Year'}
            </Text>
            <Octicons name="calendar" size={16} color={COLORS.gray} />
          </TouchableOpacity>

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
          {/* Insurance Type Dropdown */}
          <Text style={styles.inputLabel}>Insurance type *</Text>
          <TouchableOpacity 
            style={styles.pickerInput}
            onPress={() => setModalType('insurance')}
          >
            <Text style={[styles.pickerText, !insuranceType && { color: COLORS.gray }]}>
              {insuranceType || 'Select Type'}
            </Text>
            <Octicons name="chevron-down" size={16} color={COLORS.gray} />
          </TouchableOpacity>

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
            label="Premium amount (KES)"
            value={premium}
            onChangeText={setPremium}
            placeholder="Enter amount"
            keyboardType="numeric"
          />

          {/* Start Date Picker */}
          <Text style={styles.inputLabel}>Start date *</Text>
          <TouchableOpacity 
            style={styles.pickerInput}
            onPress={() => setModalType('date')}
          >
            <Text style={[styles.pickerText, !startDate && { color: COLORS.gray }]}>
              {startDate || 'YYYY-MM-DD'}
            </Text>
            <Octicons name="calendar" size={16} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Payment Frequency Dropdown */}
          <Text style={styles.inputLabel}>Payment frequency *</Text>
          <TouchableOpacity 
            style={styles.pickerInput}
            onPress={() => setModalType('frequency')}
          >
            <Text style={[styles.pickerText, !paymentFrequency && { color: COLORS.gray }]}>
              {paymentFrequency.label || 'Select Frequency'}
            </Text>
            <Octicons name="chevron-down" size={16} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Expiry Date (Read Only / Auto Calculated) */}
          <View style={styles.readOnlyContainer}>
            <Text style={styles.inputLabel}>Renewal / Expiry date (Auto)</Text>
            <View style={[styles.pickerInput, { backgroundColor: '#f0f0f0' }]}>
              <Text style={styles.pickerText}>{expiryDate || '--'}</Text>
              <Octicons name="lock" size={14} color={COLORS.gray} />
            </View>
          </View>
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

      {/* ========================
          Reusable Picker Modal
      ======================== */}
      <SelectionModal 
        visible={modalType !== null}
        onClose={() => setModalType(null)}
      >
        {modalType === 'country' && (
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setPhoneCode(item.code); setModalType(null); }}>
                <Text style={styles.modalItemText}>{item.name} ({item.code})</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {modalType === 'altCountry' && (
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setAltPhoneCode(item.code); setModalType(null); }}>
                <Text style={styles.modalItemText}>{item.name} ({item.code})</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {modalType === 'insurance' && (
          <FlatList
            data={INSURANCE_TYPES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setInsuranceType(item); setModalType(null); }}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {modalType === 'year' && (
          <FlatList
            data={YEARS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setYear(item); setModalType(null); }}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {modalType === 'frequency' && (
          <FlatList
            data={FREQUENCIES}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setPaymentFrequency(item); setModalType(null); }}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {modalType === 'date' && (
          <DatePickerModal 
            onClose={() => setModalType(null)} 
            onSelect={setStartDate} 
          />
        )}
      </SelectionModal>

    </KeyboardAvoidingView>
  );
}

/* ========================
   Reusable Components
======================== */
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SelectionModal = ({ visible, onClose, children }) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Option</Text>
            <TouchableOpacity onPress={onClose}>
              <Octicons name="x" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
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
  // New Styles
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
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
  },
  phoneInputContainer: {
    width: '68%',
    marginBottom: 0, // Override Input default margin
  },
  pickerInput: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray + '40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  pickerText: {
    fontFamily: 'Regular',
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  readOnlyContainer: {
    opacity: 0.8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: SIZES.medium,
    fontFamily: 'Regular',
  },
  // Custom Date Modal Internal Styles
  datePickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});