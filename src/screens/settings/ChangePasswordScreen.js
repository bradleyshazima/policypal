import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
// Import the actual API service
import api from '../../services/api'; 

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const passwordStrength = (password) => {
    if (password.length === 0) return { label: '', color: COLORS.gray, strength: 0 };
    if (password.length < 6) return { label: 'Weak', color: COLORS.danger, strength: 1 };
    if (password.length < 10) return { label: 'Medium', color: COLORS.warning, strength: 2 };
    return { label: 'Strong', color: COLORS.success, strength: 3 };
  };

  const strength = passwordStrength(newPassword);

  const handleChangePassword = async () => {
    // 1. Basic Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setAlertConfig({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all password fields',
      });
      setShowAlert(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertConfig({
        type: 'danger',
        title: "Passwords Don't Match",
        message: 'New password and confirmation password must match',
      });
      setShowAlert(true);
      return;
    }

    if (newPassword.length < 6) {
      setAlertConfig({
        type: 'warning',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long',
      });
      setShowAlert(true);
      return;
    }

    // 2. Real API Call
    setLoading(true);
    try {
      // This calls the PUT /auth/change-password endpoint in your api.js
      await api.auth.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword
      });

      setAlertConfig({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been updated successfully. Please use your new password next time you log in.',
      });
      setShowAlert(true);
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Change password error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Update Failed',
        message: error.message || 'Could not update password. Ensure your current password is correct.',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
  <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
  >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.infoCard}>
        <Octicons name="shield-lock" size={24} color={COLORS.blue} />
        <Text style={styles.infoText}>
          Choose a strong password to keep your account secure
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password Requirements</Text>
        <View style={styles.card}>
          <RequirementItem
            text="At least 6 characters"
            met={newPassword.length >= 6}
          />
          <RequirementItem
            text="Contains uppercase and lowercase letters"
            met={/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)}
          />
          <RequirementItem
            text="Contains numbers"
            met={/\d/.test(newPassword)}
          />
          <RequirementItem
            text="Contains special characters"
            met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInput}>
              <Input
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry={!showCurrent}
                containerStyle={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrent(!showCurrent)}
              >
                <Octicons
                  name={showCurrent ? 'eye' : 'eye-closed'}
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInput}>
              <Input
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNew}
                containerStyle={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNew(!showNew)}
              >
                <Octicons
                  name={showNew ? 'eye' : 'eye-closed'}
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: `${(strength.strength / 3) * 100}%`,
                        backgroundColor: strength.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInput}>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirm}
                containerStyle={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Octicons
                  name={showConfirm ? 'eye' : 'eye-closed'}
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && (
              <View style={styles.matchIndicator}>
                {newPassword === confirmPassword ? (
                  <>
                    <Octicons name="check" size={14} color={COLORS.success} />
                    <Text style={styles.matchText}>Passwords match</Text>
                  </>
                ) : (
                  <>
                    <Octicons name="x" size={14} color={COLORS.danger} />
                    <Text style={[styles.matchText, { color: COLORS.danger }]}>
                      Passwords don't match
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Change Password"
          onPress={handleChangePassword}
          loading={loading}
        />
        <Button
          title="Cancel"
          variant="secondary"
          onPress={() => navigation.goBack()}
          disabled={loading}
        />
      </View>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => {
          setShowAlert(false);
          if (alertConfig.type === 'success') {
            navigation.goBack();
          }
        }}
      />
    </ScrollView>
</KeyboardAvoidingView>
  );
}

const RequirementItem = ({ text, met }) => (
  <View style={styles.requirementItem}>
    <Octicons
      name={met ? 'check-circle-fill' : 'circle'}
      size={16}
      color={met ? COLORS.success : COLORS.gray}
    />
    <Text style={[styles.requirementText, met && styles.requirementMet]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.blue,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
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
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  requirementText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  requirementMet: {
    color: COLORS.success,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  passwordInput: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
    zIndex: 1,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  matchText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.success,
  },
  actions: {
    gap: 12,
  },
});