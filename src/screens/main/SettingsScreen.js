import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function SettingsScreen({ navigation }) {
  // State for toggles
  const [autoReminders, setAutoReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [reminderConfirmations, setReminderConfirmations] = useState(true);
  const [clientAlerts, setClientAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ==================== ACCOUNT SECTION ==================== */}
      <Section title="Account">
        <MenuItem
          icon="person"
          label="Profile Settings"
          onPress={() => navigation.navigate('Profile')}
        />
        <MenuItem
          icon="lock"
          label="Change Password"
          onPress={() => console.log('Change password')}
        />
      </Section>

      {/* ==================== REMINDER SETTINGS ==================== */}
      <Section title="Reminder Settings">
        <MenuItem
          icon="clock"
          label="Default Reminder Timings"
          value="15, 10, 5, 1 days"
          onPress={() => console.log('Reminder timings')}
        />
        <MenuItem
          icon="note"
          label="Default Message Templates"
          onPress={() => navigation.navigate('MessageTemplates')}
        />
        <MenuItem
          icon="paper-airplane"
          label="Default Delivery Method"
          value="SMS"
          onPress={() => console.log('Delivery method')}
        />
        <MenuItemWithSwitch
          icon="zap"
          label="Auto-Reminder"
          description="Automatically send reminders"
          value={autoReminders}
          onValueChange={setAutoReminders}
        />
      </Section>

      {/* ==================== NOTIFICATION SETTINGS ==================== */}
      <Section title="Notification Settings">
        <MenuItemWithSwitch
          icon="bell"
          label="Push Notifications"
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
        <MenuItemWithSwitch
          icon="mail"
          label="Email Notifications"
          value={emailNotifications}
          onValueChange={setEmailNotifications}
        />
        <MenuItemWithSwitch
          icon="check-circle"
          label="Reminder Confirmations"
          value={reminderConfirmations}
          onValueChange={setReminderConfirmations}
        />
        <MenuItemWithSwitch
          icon="pulse"
          label="Client Activity Alerts"
          value={clientAlerts}
          onValueChange={setClientAlerts}
        />
      </Section>

      {/* ==================== SUBSCRIPTION ==================== */}
      <Section title="Subscription">
        <View style={styles.subscriptionCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Premium Plan</Text>
              <Text style={styles.planStatus}>Active</Text>
            </View>
            <View style={styles.daysRemaining}>
              <Text style={styles.daysNumber}>14</Text>
              <Text style={styles.daysLabel}>days left</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('Subscription')}>
            <Text style={styles.upgradeButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </View>
        <MenuItem
          icon="credit-card"
          label="Payment History"
          onPress={() => console.log('Payment history')}
        />
        <MenuItem
          icon="file"
          label="Billing Information"
          onPress={() => console.log('Billing info')}
        />
      </Section>

      {/* ==================== MESSAGE TEMPLATES ==================== */}
      <Section title="Message Templates">
        <MenuItem
          icon="note"
          label="View Saved Templates"
          onPress={() => navigation.navigate('MessageTemplates')}
        />

        <MenuItem
          icon="code"
          label="Available Variables"
          value="View list"
          onPress={() => console.log('Variables')}
        />
      </Section>

      {/* ==================== INTEGRATIONS ==================== */}
      <Section title="Integrations">
        <MenuItem
          icon="plug"
          label="Twilio SMS Service"
          value="Connected"
          valueColor={COLORS.success}
          onPress={() => console.log('Twilio')}
        />
        <MenuItem
          icon="comment"
          label="WhatsApp Business"
          value="Not connected"
          valueColor={COLORS.gray}
          onPress={() => console.log('WhatsApp')}
        />
      </Section>

      {/* ==================== PREFERENCES ==================== */}
      <Section title="Preferences">
        <MenuItem
          icon="graph"
          label="Currency Preference"
          value="KES (Ksh)"
          onPress={() => console.log('Currency')}
        />

        <MenuItem
          icon="globe"
          label="Time Zone"
          value="East Africa Time"
          onPress={() => console.log('Time zone')}
        />
        <MenuItemWithSwitch
          icon="moon"
          label="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </Section>

      {/* ==================== HELP & SUPPORT ==================== */}
      <Section title="Help & Support">
        <MenuItem
          icon="question"
          label="FAQs"
          onPress={() => console.log('FAQs')}
        />
        <MenuItem
          icon="comment-discussion"
          label="Contact Support"
          onPress={() => console.log('Contact support')}
        />

        <MenuItem
          icon="star"
          label="Rate App"
          onPress={() => console.log('Rate app')}
        />
        <MenuItem
          icon="share"
          label="Share App"
          onPress={() => console.log('Share app')}
        />
      </Section>

      {/* ==================== LEGAL ==================== */}
      <Section title="Legal">
        <MenuItem
          icon="law"
          label="Terms of Service"
          onPress={() => console.log('Terms')}
        />
        <MenuItem
          icon="shield"
          label="Privacy Policy"
          onPress={() => console.log('Privacy')}
        />
        <MenuItem
          icon="info"
          label="About App"
          value="v1.0.0"
          onPress={() => console.log('About')}
        />
      </Section>

      {/* ==================== ACCOUNT ACTIONS ==================== */}
      <Section title="Account Actions">
        <MenuItem
          icon="sign-out"
          label="Logout"
          onPress={handleLogout}
          isDestructive
        />
        <MenuItem
          icon="trash"
          label="Delete Account"
          onPress={handleDeleteAccount}
          isDestructive
        />
      </Section>

      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ==================== REUSABLE COMPONENTS ==================== */

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const MenuItem = ({ 
  icon, 
  label, 
  value, 
  valueColor = COLORS.gray, 
  onPress, 
  isDestructive = false 
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View style={[
        styles.iconContainer,
        isDestructive && styles.iconContainerDestructive
      ]}>
        <Octicons
          name={icon}
          size={16}
          color={isDestructive ? COLORS.danger : COLORS.blue}
        />
      </View>
      <Text style={[
        styles.menuItemLabel,
        isDestructive && styles.menuItemLabelDestructive
      ]}>
        {label}
      </Text>
    </View>
    <View style={styles.menuItemRight}>
      {value && (
        <Text style={[styles.menuItemValue, { color: valueColor }]}>
          {value}
        </Text>
      )}
      <Octicons
        name="chevron-right"
        size={16}
        color={COLORS.gray}
      />
    </View>
  </TouchableOpacity>
);

const MenuItemWithSwitch = ({ 
  icon, 
  label, 
  description, 
  value, 
  onValueChange 
}) => (
  <View style={styles.menuItem}>
    <View style={styles.menuItemLeft}>
      <View style={styles.iconContainer}>
        <Octicons name={icon} size={16} color={COLORS.blue} />
      </View>
      <View>
        <Text style={styles.menuItemLabel}>{label}</Text>
        {description && (
          <Text style={styles.menuItemDescription}>{description}</Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.gray, true: COLORS.blue }}
      thumbColor={COLORS.white}
    />
  </View>
);

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* Section */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.base,
    color: COLORS.black,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    overflow: 'hidden',
  },

  /* Menu Item */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuItemLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  menuItemLabelDestructive: {
    color: COLORS.danger,
  },
  menuItemDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
  },

  /* Subscription Card */
  subscriptionCard: {
    padding: 16,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.blue,
  },
  planStatus: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.success,
    marginTop: 2,
  },
  daysRemaining: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  daysNumber: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.blue,
  },
  daysLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  upgradeButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});