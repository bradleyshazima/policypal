import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Share,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

// Import Modals based on your file structure
import ReminderTimingsModal from '../../components/modals/ReminderTimingsModal';
import DeliveryMethodModal from '../../components/modals/DeliveryMethodModal';
import RateAppModal from '../../components/modals/RateAppModal';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  
  // State for subscription data
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for toggles
  const [autoReminders, setAutoReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  
  // Generate dynamic styles based on current theme
  const styles = useMemo(() => getStyles(), []);

  // State for Modals
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [rateAppModalVisible, setRateAppModalVisible] = useState(false);

  // Fetch subscription data
const fetchSubscription = async () => {
    try {
      if (!refreshing) setLoadingSubscription(true);
      const response = await api.subscription.getCurrent();
      
      // CRITICAL LOGIC CHANGE HERE:
      if (response && response.subscription) {
        setSubscription(response.subscription);
      } else if (response && response.trial) {
        setSubscription({
          status: 'trial',
          plan_name: 'Trial Period',
          end_date: response.trial.endDate,
          billing_cycle: 'N/A'
        });
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Fetch subscription error:', error);
      setSubscription(null);
    } finally {
      setLoadingSubscription(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSubscription();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubscription();
  };

  const getDaysRemaining = () => {
    if (!subscription?.end_date) return 0;
    const endDate = new Date(subscription.end_date);
    const today = new Date();
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return COLORS.success;
      case 'trial': return COLORS.warning;
      case 'cancelled': 
      case 'canceled': return COLORS.danger;
      default: return COLORS.gray;
    }
  };
  
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data including clients, reminders, and settings will be permanently deleted. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => confirmDeleteAccount() 
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'Type DELETE to confirm account deletion',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'I Understand, Delete My Account', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.user.deleteAccount(); // Assuming this endpoint exists based on previous code
              await logout();
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Error', 'Failed to delete account. Please contact support.');
            }
          }
        },
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

  const daysRemaining = getDaysRemaining();
  const statusColor = getStatusColor(subscription?.status);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

        <Section title="Subscription" styles={styles}>
          {loadingSubscription ? (
            <ActivityIndicator size="small" color={COLORS.blue} style={{ padding: 20 }} />
          ) : subscription ? (
            <View style={styles.subscriptionCard}>
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>
                    {subscription.subscription_plans?.name || subscription.plan_name || 'Active Plan'}
                  </Text>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.planStatus, { color: statusColor }]}>
                      {subscription.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.daysRemaining}>
                  <Text style={styles.daysNumber}>{daysRemaining}</Text>
                  <Text style={styles.daysLabel}>days left</Text>
                </View>
              </View>

              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Octicons name="calendar" size={14} color={COLORS.gray} />
                  <Text style={styles.detailLabel}>Cycle: {subscription.billing_cycle || 'Monthly'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Octicons name="clock" size={14} color={COLORS.gray} />
                  <Text style={styles.detailLabel}>Ends: {new Date(subscription.end_date).toLocaleDateString()}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.upgradeButton} onPress={() => navigation.navigate('Subscription')}>
                <Text style={styles.upgradeButtonText}>Manage Subscription</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noSubscriptionCard}>
              <Octicons name="package" size={32} color={COLORS.gray} />
              <Text style={styles.noSubscriptionTitle}>No Active Subscription</Text>
              <TouchableOpacity style={styles.subscribeButton} onPress={() => navigation.navigate('Subscription')}>
                <Text style={styles.subscribeButtonText}>View Plans</Text>
              </TouchableOpacity>
            </View>
          )}

          
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: 12,
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
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  planName: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.blue,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  planStatus: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
  },
  daysRemaining: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
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
  subscriptionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    flex: 1,
  },
  detailValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.black,
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

  /* No Subscription Card */
  noSubscriptionCard: {
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  noSubscriptionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginTop: 12,
    marginBottom: 4,
  },
  noSubscriptionText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 16,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  subscribeButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});