import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setBusinessName(user.business_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const updates = {
        full_name: fullName,
        business_name: businessName,
        phone: phone,
      };

      const data = await api.auth.updateProfile(updates);
      updateUser(data.user);
      
      setIsEditing(false);
      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Profile updated successfully!',
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Update profile error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to update profile',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.full_name || '');
      setBusinessName(user.business_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
    setIsEditing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ==================== PROFILE HEADER ==================== */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Octicons name="person" size={48} color={COLORS.blue} />
          </View>
        </View>
        
        <Text style={styles.headerName}>{fullName || 'User'}</Text>
        <Text style={styles.headerRole}>{businessName || 'Agency'}</Text>
        
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Octicons name="pencil" size={16} color={COLORS.blue} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ==================== PROFILE INFORMATION ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.card}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          <Input
            label="Business/Agency Name"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter business name"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter email"
            inputStyle={styles.disabledInput}
            editable={false}
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            inputStyle={!isEditing && styles.disabledInput}
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancel}
              disabled={loading}
            />
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  headerName: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: 4,
  },
  headerRole: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
  },
  editButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  disabledInput: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.black,
    borderColor: 'transparent',
  },
  actionButtons: {
    marginTop: 16,
  },
});
