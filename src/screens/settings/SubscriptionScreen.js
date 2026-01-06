import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function SubscriptionScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  
  // Trial info
  const daysRemaining = 5;
  const isOnTrial = true;
  const currentPlan = 'Trial';

  const handleSelectPlan = (planName) => {
    setSelectedPlan(planName);
    Alert.alert(
      'Select Plan',
      `You've selected the ${planName} plan. Proceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => handlePayment(planName) },
      ]
    );
  };

  const handlePayment = (planName) => {
    Alert.alert(
      'Choose Payment Method',
      `Pay for ${planName}`,
      [
        { text: 'Credit/Debit Card', onPress: () => console.log('Card payment') },
        { text: 'M-Pesa', onPress: () => console.log('M-Pesa payment') },
        { text: 'PayPal', onPress: () => console.log('PayPal payment') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleContactSales = () => {
    Alert.alert(
      'Contact Sales',
      'Our sales team will reach out to you within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
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
            Your trial expires in {daysRemaining} days. After that, you'll need to upgrade to continue using all features.
          </Text>

          <View style={styles.trialFeatures}>
            <TrialFeature icon="check" text="All features unlocked" />
            <TrialFeature icon="check" text="No credit card required" />
            <TrialFeature icon="x" text="Limited to 10 clients" color={COLORS.danger} />
          </View>

          <Button
            title="Upgrade Now - Save 20%"
            onPress={() => console.log('Upgrade')}
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

        {/* FREE TRIAL */}
        <PricingCard
          name="Free Trial"
          price="$0"
          period="7 days"
          description="Perfect for getting started"
          features={[
            { text: 'Up to 10 clients', included: true },
            { text: '50 SMS/month', included: true },
            { text: 'Basic reminders', included: true },
            { text: 'Email support', included: false },
            { text: 'WhatsApp integration', included: false },
          ]}
          buttonText="Start Free Trial"
          onPress={() => handleSelectPlan('Free Trial')}
          isCurrentPlan={currentPlan === 'Trial'}
        />

        {/* BASIC PLAN */}
        <PricingCard
          name="Basic"
          price={billingCycle === 'monthly' ? '$9.99' : '$95.90'}
          period={billingCycle === 'monthly' ? '/month' : '/year'}
          description="For small agencies"
          features={[
            { text: 'Up to 50 clients', included: true },
            { text: '200 SMS/month', included: true },
            { text: 'All reminder types', included: true },
            { text: 'Email support', included: true },
            { text: 'WhatsApp integration', included: false },
            { text: 'Custom branding', included: false },
          ]}
          buttonText="Select Basic"
          onPress={() => handleSelectPlan('Basic')}
          isCurrentPlan={currentPlan === 'Basic'}
        />

        {/* PROFESSIONAL PLAN - POPULAR */}
        <PricingCard
          name="Professional"
          price={billingCycle === 'monthly' ? '$24.99' : '$239.90'}
          period={billingCycle === 'monthly' ? '/month' : '/year'}
          description="Most popular for growing agencies"
          features={[
            { text: 'Unlimited clients', included: true },
            { text: '1,000 SMS/month', included: true },
            { text: 'WhatsApp integration', included: true },
            { text: 'Custom branding', included: true },
            { text: 'Priority support', included: true },
            { text: 'Advanced analytics', included: true },
          ]}
          buttonText="Select Professional"
          onPress={() => handleSelectPlan('Professional')}
          isPopular
          isCurrentPlan={currentPlan === 'Professional'}
        />

        {/* ENTERPRISE PLAN */}
        <PricingCard
          name="Enterprise"
          price="Custom"
          period="pricing"
          description="For large agencies & teams"
          features={[
            { text: 'Everything in Professional', included: true },
            { text: 'Multiple agents/users', included: true },
            { text: 'API access', included: true },
            { text: 'Dedicated account manager', included: true },
            { text: 'Custom integrations', included: true },
            { text: 'SLA guarantee', included: true },
          ]}
          buttonText="Contact Sales"
          onPress={handleContactSales}
          isEnterprise
        />
      </View>

      {/* ==================== PAYMENT METHODS ==================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accepted Payment Methods</Text>
        
        <View style={styles.paymentMethods}>
          <PaymentMethod icon="credit-card" label="Card" />
          <PaymentMethod icon="device-mobile" label="M-Pesa" />
          <PaymentMethod icon="paypal" label="PayPal" fontAwesome />
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
    color:COLORS.blue
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
    fontSize: 36,
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
});