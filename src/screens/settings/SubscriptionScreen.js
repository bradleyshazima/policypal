import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function SubscriptionScreen({ navigation }) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [trialInfo, setTrialInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Fetch plans and current subscription in parallel
      const [plansData, subscriptionData] = await Promise.all([
        api.subscription.getPlans(),
        api.subscription.getCurrent().catch(() => null),
      ]);

      setPlans(plansData.plans || []);
      setCurrentSubscription(subscriptionData?.subscription || null);
      setTrialInfo(subscriptionData?.trial || null);
    } catch (error) {
      console.error('Fetch subscription data error:', error);
      Alert.alert('Error', 'Failed to load subscription information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSubscriptionData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubscriptionData();
  };

  const formatPrice = (amount) => {
    if (!amount) return 'KES 0';
    return `KES ${parseFloat(amount).toLocaleString('en-KE', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const calculateYearlyPrice = (monthlyPrice) => {
    // If yearly price is provided in DB, use it
    // Otherwise calculate with 20% discount
    const yearly = monthlyPrice * 12 * 0.8; // 20% discount
    return yearly;
  };

  const handleSelectPlan = async (plan) => {
    if (plan.name === 'Trial') {
      Alert.alert(
        'Trial Plan',
        'You are already on or have completed your trial period.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedPlan(plan.id);
    Alert.alert(
      'Select Plan',
      `You've selected the ${plan.name} plan (${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}). Proceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => handlePayment(plan) },
      ]
    );
  };

  const handlePayment = async (plan) => {
    try {
      // Create subscription
      const response = await api.subscription.create({
        planId: plan.id,
        billingCycle: billingCycle,
      });

      if (response.paymentRequired) {
        // Navigate to payment screen or show payment options
        Alert.alert(
          'Choose Payment Method',
          `Pay for ${plan.name} - ${billingCycle === 'monthly' ? formatPrice(plan.price_monthly) : formatPrice(plan.price_yearly)}`,
          [
            { text: 'Credit/Debit Card', onPress: () => console.log('Card payment') },
            { text: 'M-Pesa', onPress: () => console.log('M-Pesa payment') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message || 'Failed to process payment');
    }
  };

  const handleContactSales = () => {
    Alert.alert(
      'Contact Sales',
      'Our sales team will reach out to you within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading subscription plans...</Text>
      </View>
    );
  }

  const isOnTrial = trialInfo?.status === 'trial';
  const daysRemaining = trialInfo?.daysRemaining || 0;
  const currentPlanName = currentSubscription?.subscription_plans?.name || (isOnTrial ? 'Trial' : null);

  // Sort plans by price for display
  const sortedPlans = [...plans].sort((a, b) => {
    const priceA = billingCycle === 'monthly' ? a.price_monthly : a.price_yearly;
    const priceB = billingCycle === 'monthly' ? b.price_monthly : b.price_yearly;
    return priceA - priceB;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* ==================== TRIAL STATUS CARD ==================== */}
      {isOnTrial && (
        <View style={styles.trialCard}>
          <View style={styles.trialHeader}>
            <View style={styles.trialBadge}>
              <Octicons name="clock" size={16} color={COLORS.white} />
              <Text style={styles.trialBadgeText}>Trial Active</Text>
            </View>
            <View style={styles.daysContainer}>
              <Text style={styles.daysNumber}>{daysRemaining}</Text>
              <Text style={styles.daysLabel}>days left</Text>
            </View>
          </View>

          <Text style={styles.trialTitle}>Enjoying PolicyPal?</Text>
          <Text style={styles.trialDescription}>
            Your trial expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}. After that, you'll need to upgrade to continue using all features.
          </Text>

          <View style={styles.trialFeatures}>
            <TrialFeature icon="check" text="All features unlocked" />
            <TrialFeature icon="check" text="No credit card required" />
            <TrialFeature icon="x" text="Limited to 10 clients" color={COLORS.danger} />
          </View>

          <Button
            title="Upgrade Now - Save 20%"
            onPress={() => setBillingCycle('yearly')}
            style={styles.upgradeButton}
            textStyle={{ color: COLORS.blue }}
          />
          <TouchableOpacity style={styles.continueTrialButton}>
            <Text style={styles.continueTrialText}>Continue with Trial</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ==================== BILLING TOGGLE ==================== */}
      <View style={styles.billingToggle}>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            billingCycle === 'monthly' && styles.toggleOptionActive,
          ]}
          onPress={() => setBillingCycle('monthly')}
        >
          <Text
            style={[
              styles.toggleText,
              billingCycle === 'monthly' && styles.toggleTextActive,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            billingCycle === 'yearly' && styles.toggleOptionActive,
          ]}
          onPress={() => setBillingCycle('yearly')}
        >
          <Text
            style={[
              styles.toggleText,
              billingCycle === 'yearly' && styles.toggleTextActive,
            ]}
          >
            Yearly
          </Text>
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>Save 20%</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ==================== PRICING PLANS ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

        {sortedPlans.map((plan, index) => {
          const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
          const features = plan.features || [];
          
          // Skip trial plan in the list (it's shown in banner)
          if (plan.name === 'Trial') return null;

          // Determine if this is the professional/popular plan
          const isPopular = plan.name.toLowerCase().includes('professional');
          const isEnterprise = plan.name.toLowerCase().includes('enterprise');
          const isCurrentPlan = currentPlanName === plan.name;

          // Format features array
          const rawFeatures = Array.isArray(plan.features) ? plan.features : [];

          const formattedFeatures = [
            { 
              text: plan.max_clients 
                ? `Up to ${plan.max_clients} clients` 
                : 'Unlimited clients', 
              included: true 
            },
            { 
              text: plan.sms_quota 
                ? `${plan.sms_quota.toLocaleString()} SMS/month` 
                : 'Unlimited SMS', 
              included: true 
            },
            // Use rawFeatures here instead of features
            ...rawFeatures.map(feature => ({
              text: typeof feature === 'string' ? feature : feature.text,
              included: typeof feature === 'string' ? true : feature.included !== false,
            }))
          ];

          return (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={formatPrice(price)}
              period={billingCycle === 'monthly' ? '/month' : '/year'}
              description={plan.description || ''}
              features={formattedFeatures}
              buttonText={isEnterprise ? 'Contact Sales' : `Select ${plan.name}`}
              onPress={() => isEnterprise ? handleContactSales() : handleSelectPlan(plan)}
              isPopular={isPopular}
              isEnterprise={isEnterprise}
              isCurrentPlan={isCurrentPlan}
            />
          );
        })}

        {sortedPlans.length === 0 && (
          <View style={styles.emptyState}>
            <Octicons name="package" size={64} color={COLORS.gray} opacity={0.5} />
            <Text style={styles.emptyTitle}>No Plans Available</Text>
            <Text style={styles.emptyMessage}>
              Please check back later or contact support
            </Text>
          </View>
        )}
      </View>

      {/* ==================== PAYMENT METHODS ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accepted Payment Methods</Text>
        
        <View style={styles.paymentMethods}>
          <PaymentMethod icon="credit-card" label="Card" />
          <PaymentMethod icon="device-mobile" label="M-Pesa" />
        </View>
      </View>

      {/* ==================== FAQ/INFO ==================== */}
      <View style={styles.infoSection}>
        <InfoItem
          icon="shield"
          title="Secure Payments"
          description="All transactions are encrypted and secure"
        />
        <InfoItem
          icon="sync"
          title="Cancel Anytime"
          description="No long-term contracts or cancellation fees"
        />
        <InfoItem
          icon="mail"
          title="24/7 Support"
          description="Get help whenever you need it"
        />
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ==================== COMPONENTS ==================== */

const TrialFeature = ({ icon, text, color = COLORS.success }) => (
  <View style={styles.trialFeatureItem}>
    <Octicons name={icon} size={16} color={color} />
    <Text style={styles.trialFeatureText}>{text}</Text>
  </View>
);

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  onPress,
  isPopular = false,
  isEnterprise = false,
  isCurrentPlan = false,
}) => (
  <View style={[
    styles.pricingCard,
    isPopular && styles.popularCard,
  ]}>
    {isPopular && (
      <View style={styles.popularBadge}>
        <Octicons name="star-fill" size={12} color={COLORS.white} />
        <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
      </View>
    )}

    <View style={styles.pricingHeader}>
      <Text style={styles.planName}>{name}</Text>
      <Text style={styles.planDescription}>{description}</Text>
    </View>

    <View style={styles.pricingPrice}>
      <Text style={styles.priceAmount}>{price}</Text>
      {!isEnterprise && <Text style={styles.pricePeriod}>{period}</Text>}
    </View>

    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Octicons
            name={feature.included ? 'check' : 'x'}
            size={16}
            color={feature.included ? COLORS.success : COLORS.gray}
          />
          <Text
            style={[
              styles.featureText,
              !feature.included && styles.featureTextDisabled,
            ]}
          >
            {feature.text}
          </Text>
        </View>
      ))}
    </View>

    {isCurrentPlan ? (
      <View style={styles.currentPlanButton}>
        <Text style={styles.currentPlanText}>Current Plan</Text>
      </View>
    ) : (
      <Button
        title={buttonText}
        onPress={onPress}
        variant={isPopular ? 'primary' : 'secondary'}
      />
    )}
  </View>
);

const PaymentMethod = ({ icon, label, fontAwesome = false }) => {
  const IconComponent = fontAwesome ? FontAwesome : Octicons;
  return (
    <View style={styles.paymentMethod}>
      <IconComponent name={icon} size={24} color={COLORS.blue} />
      <Text style={styles.paymentMethodLabel}>{label}</Text>
    </View>
  );
};

const InfoItem = ({ icon, title, description }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIcon}>
      <Octicons name={icon} size={20} color={COLORS.blue} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDescription}>{description}</Text>
    </View>
  </View>
);

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    padding: 16,
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

  /* Trial Card */
  trialCard: {
    backgroundColor: COLORS.blue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  trialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trialBadgeText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },
  daysContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  daysNumber: {
    fontFamily: 'Bold',
    fontSize: SIZES.xlarge,
    color: COLORS.blue,
  },
  daysLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  trialTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.white,
    marginBottom: 8,
  },
  trialDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 16,
  },
  trialFeatures: {
    marginBottom: 20,
  },
  trialFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  trialFeatureText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  upgradeButton: {
    backgroundColor: COLORS.white,
  },
  continueTrialButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  continueTrialText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.white,
    textDecorationLine: 'underline',
  },

  /* Billing Toggle */
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  toggleOptionActive: {
    backgroundColor: COLORS.blue,
  },
  toggleText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: COLORS.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saveBadgeText: {
    fontFamily: 'Bold',
    fontSize: 8,
    color: COLORS.white,
  },

  /* Section */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 16,
    textAlign: 'center',
  },

  /* Pricing Card */
  pricingCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  popularCard: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.white,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontFamily: 'Bold',
    fontSize: 10,
    color: COLORS.white,
  },
  pricingHeader: {
    marginBottom: 16,
  },
  planName: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: 4,
  },
  planDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  pricingPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  priceAmount: {
    fontFamily: 'Bold',
    fontSize: 28,
    color: COLORS.blue,
  },
  pricePeriod: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  featureText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  featureTextDisabled: {
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  currentPlanButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },

  /* Payment Methods */
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
  },
  paymentMethod: {
    alignItems: 'center',
    gap: 8,
  },
  paymentMethodLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.black,
  },

  /* Info Section */
  infoSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 2,
  },
  infoDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },

  /* Empty State */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
});