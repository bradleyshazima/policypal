import React, { useState, useMemo } from 'react';
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
import { Share } from 'react-native';

// Import Modals based on your file structure
import ReminderTimingsModal from '../../components/modals/ReminderTimingsModal';
import DeliveryMethodModal from '../../components/modals/DeliveryMethodModal';
import CurrencyModal from '../../components/modals/CurrencyModal';
import TimeZoneModal from '../../components/modals/TimeZoneModal';
import RateAppModal from '../../components/modals/RateAppModal';

export default function SettingsScreen({ navigation }) {
  // State for toggles
  const [autoReminders, setAutoReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [reminderConfirmations, setReminderConfirmations] = useState(true);
  const [clientAlerts, setClientAlerts] = useState(true);
  
  // Theme Context
  // const { isDarkMode, toggleDarkMode } = useTheme();

  // Generate dynamic styles based on current theme
  const styles = useMemo(() => getStyles());

  // State for Modals
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [timeZoneModalVisible, setTimeZoneModalVisible] = useState(false);
  const [rateAppModalVisible, setRateAppModalVisible] = useState(false);

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out PolicyPal - The best insurance reminder app! Download now: https://policypal.com',
        title: 'PolicyPal Insurance Management'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== ACCOUNT SECTION ==================== */}
        <Section title="Account" styles={styles}>
          <MenuItem
            icon="person"
            label="Profile Settings"
            onPress={() => navigation.navigate('Profile')}
            styles={styles}
          />
          <MenuItem
            icon="lock"
            label="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
            styles={styles}
          />
        </Section>

        {/* ==================== REMINDER SETTINGS ==================== */}
        <Section title="Reminder Settings" styles={styles}>
          <MenuItem
            icon="clock"
            label="Default Reminder Timings"
            value="15, 10, 5, 1 days"
            onPress={() => setReminderModalVisible(true)}
            styles={styles}
          />
          <MenuItem
            icon="note"
            label="Default Message Templates"
            onPress={() => navigation.navigate('MessageTemplates')}
            styles={styles}
          />
          <MenuItem
            icon="paper-airplane"
            label="Default Delivery Method"
            value="SMS"
            onPress={() => setDeliveryModalVisible(true)}
            styles={styles}
          />
          <MenuItemWithSwitch
            icon="zap"
            label="Auto-Reminder"
            description="Automatically send reminders"
            value={autoReminders}
            onValueChange={setAutoReminders}
            styles={styles}
          />
        </Section>

        {/* ==================== NOTIFICATION SETTINGS ==================== */}
        <Section title="Notification Settings" styles={styles}>
          <MenuItemWithSwitch
            icon="bell"
            label="Push Notifications"
            value={pushNotifications}
            onValueChange={setPushNotifications}
            styles={styles}
          />
          <MenuItemWithSwitch
            icon="mail"
            label="Email Notifications"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            styles={styles}
          />
          <MenuItemWithSwitch
            icon="check-circle"
            label="Reminder Confirmations"
            value={reminderConfirmations}
            onValueChange={setReminderConfirmations}
            styles={styles}
          />
          <MenuItemWithSwitch
            icon="pulse"
            label="Client Activity Alerts"
            value={clientAlerts}
            onValueChange={setClientAlerts}
            styles={styles}
          />
        </Section>

        {/* ==================== SUBSCRIPTION ==================== */}
        <Section title="Subscription" styles={styles}>
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
            onPress={() => navigation.navigate('PaymentHistory')}
            styles={styles}
          />
          <MenuItem
            icon="file"
            label="Billing Information"
            onPress={() => navigation.navigate('BillingInfo')}
            styles={styles}
          />
        </Section>

        {/* ==================== INTEGRATIONS ==================== */}
        <Section title="Integrations" styles={styles}>
          <MenuItem
            icon="plug"
            label="Twilio SMS Service"
            value="Connected"
            valueColor={COLORS.success}
            onPress={() => console.log('Twilio')}
            styles={styles}
          />
          <MenuItem
            icon="comment"
            label="WhatsApp Business"
            value="Not connected"
            valueColor={COLORS.gray}
            onPress={() => console.log('WhatsApp')}
            styles={styles}
          />
        </Section>

        {/* ==================== PREFERENCES ==================== */}
        <Section title="Preferences" styles={styles}>
          <MenuItem
            icon="graph"
            label="Currency Preference"
            value="KES (Ksh)"
            onPress={() => setCurrencyModalVisible(true)}
            styles={styles}
          />

          <MenuItem
            icon="globe"
            label="Time Zone"
            value="East Africa Time"
            onPress={() => setTimeZoneModalVisible(true)}
            styles={styles}
          />
        </Section>

        {/* ==================== HELP & SUPPORT ==================== */}
        <Section title="Help & Support" styles={styles}>
          <MenuItem
            icon="question"
            label="FAQs"
            onPress={() => navigation.navigate('FAQs')}
            styles={styles}
          />
          <MenuItem
            icon="comment-discussion"
            label="Contact Support"
            onPress={() => navigation.navigate('ContactSupport')}
            styles={styles}
          />

          <MenuItem
            icon="star"
            label="Rate App"
            onPress={() => setRateAppModalVisible(true)}
            styles={styles}
          />
          <MenuItem
            icon="share"
            label="Share App"
            onPress={handleShare}
            styles={styles}
          />
        </Section>

        {/* ==================== LEGAL ==================== */}
        <Section title="Legal" styles={styles}>
          <MenuItem
            icon="law"
            label="Terms of Service"
            onPress={() => navigation.navigate('Terms')}
            styles={styles}
          />
          <MenuItem
            icon="shield"
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
            styles={styles}
          />
          <MenuItem
            icon="info"
            label="About App"
            value="v1.0.0"
            onPress={() => navigation.navigate('AboutApp')}
            styles={styles}
          />
        </Section>

        {/* ==================== ACCOUNT ACTIONS ==================== */}
        <Section title="Account Actions" styles={styles}>
          <MenuItem
            icon="sign-out"
            label="Logout"
            onPress={handleLogout}
            isDestructive
            styles={styles}
          />
          <MenuItem
            icon="trash"
            label="Delete Account"
            onPress={handleDeleteAccount}
            isDestructive
            styles={styles}
          />
        </Section>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ==================== MODALS ==================== */}
      <ReminderTimingsModal
        visible={reminderModalVisible}
        onClose={() => setReminderModalVisible(false)}
      />
      <DeliveryMethodModal
        visible={deliveryModalVisible}
        onClose={() => setDeliveryModalVisible(false)}
      />
      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
      />
      <TimeZoneModal
        visible={timeZoneModalVisible}
        onClose={() => setTimeZoneModalVisible(false)}
      />
      <RateAppModal
        visible={rateAppModalVisible}
        onClose={() => setRateAppModalVisible(false)}
      />
    </>
  );
}

/* ==================== REUSABLE COMPONENTS ==================== */

const Section = ({ title, children, styles }) => (
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
  isDestructive = false,
  styles
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
  onValueChange,
  styles
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

const getStyles = () => StyleSheet.create({
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
    color: COLORS.text, // Ensure this uses a theme color
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