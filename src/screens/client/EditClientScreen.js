import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback
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

// Generate years for picker
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export default function EditClientScreen({ navigation, route }) {
  const { clientId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  // Modal State
  const [modalType, setModalType] = useState(null);

  /* ========================
      Personal Info
  ======================== */
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  // Phone Split State
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
  const [year, setYear] = useState(''); // Picker
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');

  /* ========================
      Insurance Info
  ======================== */
  const [insuranceType, setInsuranceType] = useState(''); // Picker
  const [company, setCompany] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [premium, setPremium] = useState('');
  const [currency, setCurrency] = useState('KES');
  
  const [startDate, setStartDate] = useState(''); // Picker (YYYY-MM-DD)
  const [expiryDate, setExpiryDate] = useState(''); // Auto-calculated
  const [paymentFrequency, setPaymentFrequency] = useState(''); // Object {label, value, months}

  /* ========================
      Reminder Settings
  ======================== */
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  // --- Initial Data Fetch ---
  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  // --- Auto-Calculate Expiry ---
  useEffect(() => {
    // Only calculate if we are not currently loading the initial data to avoid overwriting existing
    if (!loading && startDate && paymentFrequency) {
      calculateExpiry(startDate, paymentFrequency.months || 12);
      markAsChanged();
    }
  }, [startDate, paymentFrequency]);

  const calculateExpiry = (startStr, monthsToAdd) => {
    const dateParts = startStr.split('-');
    if (dateParts.length !== 3) return;
    
    const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    d.setMonth(d.getMonth() + monthsToAdd);
    
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setExpiryDate(`${y}-${m}-${day}`);
  };

  const parsePhoneForDisplay = (fullNumber) => {
    if (!fullNumber) return { code: '+254', number: '' };
    const strNum = fullNumber.toString();
    
    // Try to match known country codes
    for (let c of COUNTRIES) {
      const cleanCode = c.code.replace('+', '');
      if (strNum.startsWith(cleanCode)) {
        return {
          code: c.code,
          number: strNum.substring(cleanCode.length)
        };
      }
    }
    // Fallback default
    return { code: '+254', number: strNum };
  };

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const data = await api.clients.getById(clientId);
      const client = data.client;

      // Populate form
      setFullName(client.full_name || '');
      
      // Parse Phones
      const p1 = parsePhoneForDisplay(client.phone);
      setPhoneCode(p1.code);
      setPhoneNumber(p1.number);

      const p2 = parsePhoneForDisplay(client.alt_phone);
      setAltPhoneCode(p2.code);
      setAltPhoneNumber(p2.number);

      setEmail(client.email || '');
      setAddress(client.address || '');
      setIdNumber(client.id_number || '');
      
      setMake(client.car_make || '');
      setModel(client.car_model || '');
      setYear(client.car_year ? client.car_year.toString() : '');
      setPlate(client.plate_number || '');
      setVin(client.vin_number || '');
      setColor(client.car_color || '');
      
      setInsuranceType(client.insurance_type || '');
      setCompany(client.insurance_company || '');
      setPolicyNumber(client.policy_number || '');
      setPremium(client.coverage_amount ? client.coverage_amount.toString() : '');
      setCurrency(client.currency || 'KES');
      
      setStartDate(client.start_date || '');
      setExpiryDate(client.expiry_date || '');
      
      // Map frequency string back to object
      const freqObj = FREQUENCIES.find(f => f.value === client.payment_frequency);
      setPaymentFrequency(freqObj || { label: client.payment_frequency, value: client.payment_frequency, months: 12 });
      
      setRemindersEnabled(client.reminders_enabled || false);
      setCustomMessage(client.custom_message || '');

      setHasChanges(false); // Reset changes after load
    } catch (error) {
      console.error('Fetch client error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to load client data',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const markAsChanged = () => {
    if (!loading && !hasChanges) setHasChanges(true);
  };

  const handleFullNameChange = (text) => {
    setFullName(text);
    markAsChanged();
    if (text.trim().split(' ').length < 2) {
      setFullNameError('Add a last name');
    } else {
      setFullNameError('');
    }
  };

  const formatPhoneForSave = (code, number) => {
    if (!number) return null;
    const cleanCode = code.replace('+', '');
    const cleanNumber = number.startsWith('0') ? number.substring(1) : number;
    return `${cleanCode}${cleanNumber}`;
  };

  const handleSave = async () => {
    // Validation
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
        setFullNameError('Add a last name');
        setAlertConfig({ type: 'warning', title: 'Invalid Name', message: 'Please enter at least two names.' });
        setShowAlert(true);
        return;
    }
    if (!phoneNumber) {
        setAlertConfig({ type: 'warning', title: 'Missing Info', message: 'Phone number is required.' });
        setShowAlert(true);
        return;
    }

    setSaving(true);

    try {
      const finalPhone = formatPhoneForSave(phoneCode, phoneNumber);
      const finalAltPhone = formatPhoneForSave(altPhoneCode, altPhoneNumber);

      const updates = {
        full_name: fullName,
        phone: finalPhone,
        alt_phone: finalAltPhone || null,
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
        payment_frequency: paymentFrequency.value || null,
        reminders_enabled: remindersEnabled,
        custom_message: customMessage || null,
      };

      await api.clients.update(clientId, updates);
      
      setHasChanges(false);
      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Client updated successfully!',
      });
      setShowAlert(true);

      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error) {
      console.error('Update client error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to update client',
      });
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setAlertConfig({
        type: 'warning',
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
      });
      setShowAlert(true);
    } else {
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    setAlertConfig({
      type: 'danger',
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
    });
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await api.clients.delete(clientId);
      navigation.navigate('ClientsList');
    } catch (error) {
      console.error('Delete client error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to delete client',
      });
      setShowAlert(true);
    }
  };

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
            containerStyle={{ width: 80 }}
            inputStyle={{ textAlign: "center" }}
          />

          <Input 
            value={String(dMonth)} 
            onChangeText={(t) => setDMonth(t)} 
            placeholder="MM" 
            keyboardType="numeric"
            containerStyle={{ width: 60 }}
            inputStyle={{ textAlign: "center" }}
          />

          <Input 
            value={String(dDay)} 
            onChangeText={(t) => setDDay(t)} 
            placeholder="DD" 
            keyboardType="numeric"
            containerStyle={{ width: 60 }}
            inputStyle={{ textAlign: "center" }}
          />
        </View>
        <Button title="Confirm Date" onPress={confirmDate} style={{marginTop: 10}} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading client data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* ==================== HEADER INFO CARD ==================== */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Octicons name="person" size={32} color={COLORS.blue} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{fullName}</Text>
          <Text style={styles.headerSubtext}>{plate} • {insuranceType}</Text>
        </View>
        {hasChanges && (
          <View style={styles.unsavedBadge}>
            <Text style={styles.unsavedText}>Unsaved</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
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

          {/* Phone Number Split */}
          <Text style={styles.inputLabel}>Phone number *</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity 
              style={styles.countryPicker}
              onPress={() => setModalType('country')}
            >
              <Text style={styles.pickerText}>{phoneCode}</Text>
              <Octicons name="chevron-down" size={16} color={COLORS.gray} />
            </TouchableOpacity>
            
            <Input 
              containerStyle={styles.phoneInputContainer}
              value={phoneNumber} 
              onChangeText={(t) => { setPhoneNumber(t); markAsChanged(); }}
              placeholder="7XX XXX XXX"
              keyboardType="number-pad"
            />
          </View>

          {/* Alt Phone Split */}
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
              onChangeText={(t) => { setAltPhoneNumber(t); markAsChanged(); }}
              placeholder="7XX XXX XXX"
              keyboardType="number-pad"
            />
          </View>

          <Input
            label="Email address"
            value={email}
            onChangeText={(text) => { setEmail(text); markAsChanged(); }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="email@example.com"
          />
          <Input
            label="Physical address"
            value={address}
            onChangeText={(text) => { setAddress(text); markAsChanged(); }}
            placeholder="Enter address"
          />
          <Input
            label="ID / License number"
            value={idNumber}
            onChangeText={(text) => { setIdNumber(text); markAsChanged(); }}
            placeholder="Enter ID or license"
          />
        </Section>

        {/* ========================
            Vehicle Information
        ======================== */}
        <Section title="Vehicle Information">
          <Input
            label="Car make *"
            value={make}
            onChangeText={(text) => { setMake(text); markAsChanged(); }}
            placeholder="e.g., Toyota"
          />
          <Input
            label="Car model *"
            value={model}
            onChangeText={(text) => { setModel(text); markAsChanged(); }}
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
            onChangeText={(text) => { setPlate(text); markAsChanged(); }}
            placeholder="e.g., KAA 123A"
          />
          <Input
            label="VIN number"
            value={vin}
            onChangeText={(text) => { setVin(text); markAsChanged(); }}
            placeholder="17-character VIN"
          />
          <Input
            label="Car color"
            value={color}
            onChangeText={(text) => { setColor(text); markAsChanged(); }}
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
            onChangeText={(text) => { setCompany(text); markAsChanged(); }}
            placeholder="e.g., Jubilee Insurance"
          />
          <Input
            label="Policy number"
            value={policyNumber}
            onChangeText={(text) => { setPolicyNumber(text); markAsChanged(); }}
            placeholder="Enter policy number"
          />
          <Input
            label="Premium amount (KES)"
            value={premium}
            onChangeText={(text) => { setPremium(text); markAsChanged(); }}
            keyboardType="numeric"
            placeholder="Enter amount"
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
            <Text style={styles.inputLabel}>Renewal / Expiry date</Text>
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
            onPress={() => {
              setRemindersEnabled(!remindersEnabled);
              markAsChanged();
            }}
          >
            <Text style={styles.toggleLabel}>Enable reminders</Text>
            <Octicons
              name={remindersEnabled ? 'check-circle-fill' : 'circle'}
              size={24}
              color={remindersEnabled ? COLORS.success : COLORS.gray}
            />
          </TouchableOpacity>

          {remindersEnabled && (
            <Input
              label="Custom message template (optional)"
              value={customMessage}
              onChangeText={(text) => {
                setCustomMessage(text);
                markAsChanged();
              }}
              placeholder="Enter custom reminder message..."
            />
          )}
        </Section>

        {/* ========================
            Action Buttons
        ======================== */}
        <View style={styles.actionsContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            disabled={!hasChanges || saving}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onPress={handleCancel}
            disabled={saving}
          />
          <Button
            title="Delete Client"
            variant="danger"
            onPress={handleDelete}
            disabled={saving}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.type === 'danger' ? 'Delete' : alertConfig.type === 'warning' ? 'Discard' : 'OK'}
        cancelText={alertConfig.type === 'danger' || alertConfig.type === 'warning' ? 'Cancel' : null}
        onConfirm={() => {
          if (alertConfig.type === 'danger' && alertConfig.title === 'Delete Client') {
            confirmDelete();
          } else if (alertConfig.type === 'warning') {
            if (alertConfig.title === 'Discard Changes?') {
                navigation.goBack();
            }
          }
          setShowAlert(false);
        }}
        onCancel={() => setShowAlert(false)}
      />

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
              <TouchableOpacity style={styles.modalItem} onPress={() => { setPhoneCode(item.code); setModalType(null); markAsChanged(); }}>
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
              <TouchableOpacity style={styles.modalItem} onPress={() => { setAltPhoneCode(item.code); setModalType(null); markAsChanged(); }}>
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
              <TouchableOpacity style={styles.modalItem} onPress={() => { setInsuranceType(item); setModalType(null); markAsChanged(); }}>
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
              <TouchableOpacity style={styles.modalItem} onPress={() => { setYear(item); setModalType(null); markAsChanged(); }}>
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
              <TouchableOpacity style={styles.modalItem} onPress={() => { setPaymentFrequency(item); setModalType(null); markAsChanged(); }}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {modalType === 'date' && (
          <DatePickerModal 
            onClose={() => setModalType(null)} 
            onSelect={(d) => { setStartDate(d); markAsChanged(); }} 
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
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  headerCard: {
    backgroundColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 2,
  },
  headerSubtext: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  unsavedBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unsavedText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },
  scrollContent: {
    padding: 8,
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
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 12,
  },
  toggleLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  actionsContainer: {
    marginTop: 8,
    gap: 8,
  },
  // Added from AddClientScreen for UI consistency
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
    marginBottom: 0, 
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
    marginBottom: 24,
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
  // Custom Date Modal
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