import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: January 10, 2026</Text>
      </View>

      <Section title="1. Introduction">
        <Text style={styles.paragraph}>
          PolicyPal ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
        </Text>
      </Section>

      <Section title="2. Information We Collect">
        <Text style={styles.subheading}>Personal Information</Text>
        <Text style={styles.paragraph}>
          We collect information that you provide directly to us:
        </Text>
        <BulletPoint text="Name, email address, and phone number" />
        <BulletPoint text="Business/agency information" />
        <BulletPoint text="Payment and billing information" />
        <BulletPoint text="Profile photo and preferences" />

        <Text style={styles.subheading}>Client Data</Text>
        <Text style={styles.paragraph}>
          Information you input about your clients:
        </Text>
        <BulletPoint text="Client names and contact information" />
        <BulletPoint text="Vehicle and insurance policy details" />
        <BulletPoint text="Renewal dates and payment information" />
        <BulletPoint text="Custom notes and documents" />

        <Text style={styles.subheading}>Usage Information</Text>
        <BulletPoint text="Device information and unique identifiers" />
        <BulletPoint text="Log data (IP address, browser type, pages visited)" />
        <BulletPoint text="Analytics and performance data" />
        <BulletPoint text="SMS delivery reports and statistics" />
      </Section>

      <Section title="3. How We Use Your Information">
        <Text style={styles.paragraph}>
          We use collected information for:
        </Text>
        <BulletPoint text="Providing and maintaining the Service" />
        <BulletPoint text="Processing payments and transactions" />
        <BulletPoint text="Sending automated reminders to your clients" />
        <BulletPoint text="Improving and personalizing user experience" />
        <BulletPoint text="Communicating updates and support" />
        <BulletPoint text="Analyzing usage patterns and trends" />
        <BulletPoint text="Detecting and preventing fraud or abuse" />
      </Section>

      <Section title="4. Data Sharing and Disclosure">
        <Text style={styles.paragraph}>
          We do not sell your personal information. We may share your data with:
        </Text>

        <Text style={styles.subheading}>Service Providers</Text>
        <BulletPoint text="SMS and email delivery services (Twilio, SendGrid)" />
        <BulletPoint text="Payment processors (Stripe, PayPal)" />
        <BulletPoint text="Cloud hosting providers (AWS, Google Cloud)" />
        <BulletPoint text="Analytics services (Google Analytics)" />

        <Text style={styles.subheading}>Legal Requirements</Text>
        <Text style={styles.paragraph}>
          We may disclose information if required by law or to:
        </Text>
        <BulletPoint text="Comply with legal obligations" />
        <BulletPoint text="Protect our rights and property" />
        <BulletPoint text="Prevent fraud or security issues" />
        <BulletPoint text="Respond to government requests" />
      </Section>

      <Section title="5. Data Security">
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your data:
        </Text>
        <BulletPoint text="End-to-end encryption for data transmission" />
        <BulletPoint text="Secure data storage with encryption at rest" />
        <BulletPoint text="Regular security audits and updates" />
        <BulletPoint text="Access controls and authentication" />
        <BulletPoint text="Secure payment processing (PCI-DSS compliant)" />
      </Section>

      <Section title="6. Data Retention">
        <Text style={styles.paragraph}>
          We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time, subject to legal retention requirements.
        </Text>
      </Section>

      <Section title="7. Your Rights and Choices">
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <BulletPoint text="Access your personal data" />
        <BulletPoint text="Correct inaccurate information" />
        <BulletPoint text="Request data deletion" />
        <BulletPoint text="Export your data" />
        <BulletPoint text="Opt-out of marketing communications" />
        <BulletPoint text="Disable certain data collection features" />
      </Section>

      <Section title="8. Children's Privacy">
        <Text style={styles.paragraph}>
          PolicyPal is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we discover we have collected data from a child, we will delete it immediately.
        </Text>
      </Section>

      <Section title="9. International Data Transfers">
        <Text style={styles.paragraph}>
          Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
        </Text>
      </Section>

      <Section title="10. Cookies and Tracking">
        <Text style={styles.paragraph}>
          We use cookies and similar technologies to:
        </Text>
        <BulletPoint text="Remember your preferences" />
        <BulletPoint text="Analyze usage patterns" />
        <BulletPoint text="Improve app performance" />
        <Text style={styles.paragraph}>
          You can control cookie settings through your device preferences.
        </Text>
      </Section>

      <Section title="11. Third-Party Links">
        <Text style={styles.paragraph}>
          Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to read their privacy policies.
        </Text>
      </Section>

      <Section title="12. Changes to Privacy Policy">
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification. Your continued use after changes constitutes acceptance.
        </Text>
      </Section>

      <Section title="13. Contact Us">
        <Text style={styles.paragraph}>
          For privacy-related questions or concerns, contact us at:
        </Text>
        <Text style={styles.contactInfo}>Email: privacy@policypal.com</Text>
        <Text style={styles.contactInfo}>Phone: +254 700 123 456</Text>
        <Text style={styles.contactInfo}>Address: Nairobi, Kenya</Text>
      </Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By using PolicyPal, you agree to the collection and use of information in accordance with this Privacy Policy.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const BulletPoint = ({ text }) => (
  <View style={styles.bulletPoint}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: COLORS.lightGray,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Bold',
    fontSize: SIZES.xlarge,
    color: COLORS.black,
    marginBottom: 8,
  },
  lastUpdated: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
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
  subheading: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.blue,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 12,
  },
  bullet: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.blue,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 20,
  },
  contactInfo: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
    marginBottom: 6,
  },
  footer: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  footerText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.blue,
    lineHeight: 20,
    textAlign: 'center',
  },
});