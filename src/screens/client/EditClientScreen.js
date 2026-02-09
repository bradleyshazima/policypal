import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Octicons } from '@expo/vector-icons';
import Alert from '../../components/common/Alert';
import api from '../../services/api';

export default function EditClientScreen({ navigation, route }) {
  const { clientId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

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
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const data = await api.clients.getById(clientId);
      const client = data.client;

      // Populate form with client data
      setFullName(client.full_name || '');
      setPhone(client.phone || '');
      setAltPhone(client.alt_phone || '');
      setEmail(client.email || '');
      setAddress(client.address || '');
      setIdNumber(client.id_number || '');
      
      setMake(client.car_make || '');
      setModel(client.car_model || '');
      setYear(client.car_year || '');
      setPlate(client.plate_number || '');
      setVin(client.vin_number || '');
      setColor(client.car_color || '');
      
      setInsuranceType(client.insurance_type || '');
      setCompany(client.insurance_company || '');
      setPolicyNumber(client.policy_number || '');
      setPremium(client.coverage_amount || '');
      setCurrency(client.currency || 'KES');
      setStartDate(client.start_date || '');
      setExpiryDate(client.expiry_date || '');
      setPaymentFrequency(client.payment_frequency || '');
      
      setRemindersEnabled(client.reminders_enabled || false);
      setCustomMessage(client.custom_message || '');
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
    if (!hasChanges) setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const updates = {
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
      };

      await api.clients.update(clientId, updates);
      
      setHasChanges(false);
      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Client updated successfully!',
      });
      setShowAlert(true);

      // Navigate back after short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading client data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            onChangeText={(text) => {
              setFullName(text);
              markAsChanged();
            }}
            placeholder="Enter full name"
          />
          <Input
            label="Phone number *"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              markAsChanged();
            }}
            keyboardType="phone-pad"
            placeholder="+254..."
          />
          <Input
            label="Alternative phone number"
            value={altPhone}
            onChangeText={(text) => {
              setAltPhone(text);
              markAsChanged();
            }}
            keyboardType="phone-pad"
            placeholder="+254..."
          />
          <Input
            label="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              markAsChanged();
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="email@example.com"
          />
          <Input
            label="Physical address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              markAsChanged();
            }}
            placeholder="Enter address"
          />
          <Input
            label="ID / License number"
            value={idNumber}
            onChangeText={(text) => {
              setIdNumber(text);
              markAsChanged();
            }}
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
            onChangeText={(text) => {
              setMake(text);
              markAsChanged();
            }}
            placeholder="e.g., Toyota"
          />
          <Input
            label="Car model *"
            value={model}
            onChangeText={(text) => {
              setModel(text);
              markAsChanged();
            }}
            placeholder="e.g., Corolla"
          />
          <Input
            label="Year of manufacture"
            value={year}
            onChangeText={(text) => {
              setYear(text);
              markAsChanged();
            }}
            keyboardType="number-pad"
            placeholder="YYYY"
          />
          <Input
            label="Registration / Plate number"
            value={plate}
            onChangeText={(text) => {
              setPlate(text);
              markAsChanged();
            }}
            placeholder="e.g., KAA 123A"
          />
          <Input
            label="VIN number"
            value={vin}
            onChangeText={(text) => {
              setVin(text);
              markAsChanged();
            }}
            placeholder="17-character VIN"
          />
          <Input
            label="Car color"
            value={color}
            onChangeText={(text) => {
              setColor(text);
              markAsChanged();
            }}
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
            onChangeText={(text) => {
              setInsuranceType(text);
              markAsChanged();
            }}
            placeholder="e.g., Comprehensive"
          />
          <Input
            label="Insurance company"
            value={company}
            onChangeText={(text) => {
              setCompany(text);
              markAsChanged();
            }}
            placeholder="e.g., Jubilee Insurance"
          />
          <Input
            label="Policy number"
            value={policyNumber}
            onChangeText={(text) => {
              setPolicyNumber(text);
              markAsChanged();
            }}
            placeholder="Enter policy number"
          />
          <Input
            label="Premium amount"
            value={premium}
            onChangeText={(text) => {
              setPremium(text);
              markAsChanged();
            }}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
          <Input
            label="Currency"
            value={currency}
            onChangeText={(text) => {
              setCurrency(text);
              markAsChanged();
            }}
            placeholder="KES"
          />
          <Input
            label="Start date"
            value={startDate}
            onChangeText={(text) => {
              setStartDate(text);
              markAsChanged();
            }}
            placeholder="YYYY-MM-DD"
          />
          <Input
            label="Renewal / Expiry date *"
            value={expiryDate}
            onChangeText={(text) => {
              setExpiryDate(text);
              markAsChanged();
            }}
            placeholder="YYYY-MM-DD"
          />
          <Input
            label="Payment frequency"
            value={paymentFrequency}
            onChangeText={(text) => {
              setPaymentFrequency(text);
              markAsChanged();
            }}
            placeholder="e.g., Annual, Monthly"
          />
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
            navigation.goBack();
          }
          setShowAlert(false);
        }}
        onCancel={() => setShowAlert(false)}
      />
    </View>
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
});