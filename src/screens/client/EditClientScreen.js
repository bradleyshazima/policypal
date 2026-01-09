import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Octicons } from '@expo/vector-icons';

export default function EditClientScreen({ navigation, route }) {
  // In a real app, you'd get this data from route params or state management
  const clientData = {
    fullName: 'Bradley Shazima',
    phone: '+254 712 345 678',
    altPhone: '+254 798 765 432',
    email: 'bradley@email.com',
    address: 'Nairobi, Kenya',
    idNumber: 'ID-12345678',
    make: 'Honda',
    model: 'CB150R',
    year: '2020',
    plate: 'KMTC 114A',
    vin: 'VIN123456789',
    color: 'Black',
    insuranceType: 'Third Party',
    company: 'Jubilee Insurance',
    policyNumber: 'INS-23941',
    premium: '15,000',
    currency: 'KES',
    startDate: '12/02/2024',
    expiryDate: '12/02/2026',
    paymentFrequency: 'Annual',
    remindersEnabled: true,
    customMessage: 'Please renew your insurance on time.',
  };

  /* ========================
     Personal Info
  ======================== */
  const [fullName, setFullName] = useState(clientData.fullName);
  const [phone, setPhone] = useState(clientData.phone);
  const [altPhone, setAltPhone] = useState(clientData.altPhone);
  const [email, setEmail] = useState(clientData.email);
  const [address, setAddress] = useState(clientData.address);
  const [idNumber, setIdNumber] = useState(clientData.idNumber);

  /* ========================
     Vehicle Info
  ======================== */
  const [make, setMake] = useState(clientData.make);
  const [model, setModel] = useState(clientData.model);
  const [year, setYear] = useState(clientData.year);
  const [plate, setPlate] = useState(clientData.plate);
  const [vin, setVin] = useState(clientData.vin);
  const [color, setColor] = useState(clientData.color);

  /* ========================
     Insurance Info
  ======================== */
  const [insuranceType, setInsuranceType] = useState(clientData.insuranceType);
  const [company, setCompany] = useState(clientData.company);
  const [policyNumber, setPolicyNumber] = useState(clientData.policyNumber);
  const [premium, setPremium] = useState(clientData.premium);
  const [currency, setCurrency] = useState(clientData.currency);
  const [startDate, setStartDate] = useState(clientData.startDate);
  const [expiryDate, setExpiryDate] = useState(clientData.expiryDate);
  const [paymentFrequency, setPaymentFrequency] = useState(clientData.paymentFrequency);

  /* ========================
     Reminder Settings
  ======================== */
  const [remindersEnabled, setRemindersEnabled] = useState(clientData.remindersEnabled);
  const [customMessage, setCustomMessage] = useState(clientData.customMessage);

  /* ========================
     UI State
  ======================== */
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      Alert.alert('Success', 'Client information updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Client deleted successfully');
            navigation.navigate('ClientsList');
          },
        },
      ]
    );
  };

  // Track changes
  const markAsChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

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
          <UploadBox label="Update profile photo" />

          <Input
            label="Full name *"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              markAsChanged();
            }}
          />
          <Input
            label="Phone number *"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              markAsChanged();
            }}
            keyboardType="phone-pad"
          />
          <Input
            label="Alternative phone number"
            value={altPhone}
            onChangeText={(text) => {
              setAltPhone(text);
              markAsChanged();
            }}
            keyboardType="phone-pad"
          />
          <Input
            label="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              markAsChanged();
            }}
            keyboardType="email-address"
          />
          <Input
            label="Physical address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              markAsChanged();
            }}
          />
          <Input
            label="ID / License number"
            value={idNumber}
            onChangeText={(text) => {
              setIdNumber(text);
              markAsChanged();
            }}
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
          />
          <Input
            label="Car model *"
            value={model}
            onChangeText={(text) => {
              setModel(text);
              markAsChanged();
            }}
          />
          <Input
            label="Year of manufacture"
            value={year}
            onChangeText={(text) => {
              setYear(text);
              markAsChanged();
            }}
            keyboardType="number-pad"
          />
          <Input
            label="Registration / Plate number"
            value={plate}
            onChangeText={(text) => {
              setPlate(text);
              markAsChanged();
            }}
          />
          <Input
            label="VIN number"
            value={vin}
            onChangeText={(text) => {
              setVin(text);
              markAsChanged();
            }}
          />
          <Input
            label="Car color"
            value={color}
            onChangeText={(text) => {
              setColor(text);
              markAsChanged();
            }}
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
          />
          <Input
            label="Insurance company"
            value={company}
            onChangeText={(text) => {
              setCompany(text);
              markAsChanged();
            }}
          />
          <Input
            label="Policy number"
            value={policyNumber}
            onChangeText={(text) => {
              setPolicyNumber(text);
              markAsChanged();
            }}
          />
          <Input
            label="Coverage amount / Premium *"
            value={premium}
            onChangeText={(text) => {
              setPremium(text);
              markAsChanged();
            }}
            keyboardType="number-pad"
          />
          <Input
            label="Currency"
            value={currency}
            onChangeText={(text) => {
              setCurrency(text);
              markAsChanged();
            }}
          />
          <Input
            label="Start date *"
            value={startDate}
            onChangeText={(text) => {
              setStartDate(text);
              markAsChanged();
            }}
            placeholder="DD/MM/YYYY"
          />
          <Input
            label="Renewal / Expiry date *"
            value={expiryDate}
            onChangeText={(text) => {
              setExpiryDate(text);
              markAsChanged();
            }}
            placeholder="DD/MM/YYYY"
          />
          <Input
            label="Payment frequency"
            value={paymentFrequency}
            onChangeText={(text) => {
              setPaymentFrequency(text);
              markAsChanged();
            }}
          />
        </Section>

        {/* ========================
           Documents
        ======================== */}
        <Section title="Documents">
          <DocumentItem
            label="Insurance Certificate"
            uploaded={true}
            fileName="certificate_2024.pdf"
          />
          <UploadBox label="Update insurance certificate" />
          
          <DocumentItem
            label="Car Photos"
            uploaded={true}
            fileName="3 photos"
          />
          <UploadBox label="Add more car photos" />
          
          <DocumentItem
            label="ID Copy"
            uploaded={true}
            fileName="id_copy.pdf"
          />
          <UploadBox label="Update ID copy" />
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
            loading={isSaving}
            disabled={!hasChanges}
          />
          <Button
            title="Cancel"
            variant="secondary"
            onPress={handleCancel}
          />
          <Button
            title="Delete Client"
            variant="danger"
            onPress={handleDelete}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
   Upload Placeholder
======================== */
const UploadBox = ({ label }) => (
  <TouchableOpacity style={styles.uploadBox}>
    <Octicons name="upload" size={18} color={COLORS.blue} />
    <Text style={styles.uploadText}>{label}</Text>
  </TouchableOpacity>
);

/* ========================
   Document Item
======================== */
const DocumentItem = ({ label, uploaded, fileName }) => (
  <View style={styles.documentItem}>
    <View style={styles.documentInfo}>
      <Octicons
        name={uploaded ? 'check-circle-fill' : 'circle'}
        size={20}
        color={uploaded ? COLORS.success : COLORS.gray}
      />
      <View style={styles.documentText}>
        <Text style={styles.documentLabel}>{label}</Text>
        {uploaded && <Text style={styles.documentFileName}>{fileName}</Text>}
      </View>
    </View>
    <TouchableOpacity>
      <Octicons name="eye" size={18} color={COLORS.blue} />
    </TouchableOpacity>
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

  /* Header Card */
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

  /* Scroll Content */
  scrollContent: {
    padding: 8,
    paddingBottom: 40,
  },

  /* Section */
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

  /* Upload Box */
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  uploadText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },

  /* Document Item */
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentText: {
    flex: 1,
  },
  documentLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 2,
  },
  documentFileName: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },

  /* Toggle Row */
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

  /* Actions */
  actionsContainer: {
    marginTop: 8,
    gap: 8,
  },
});