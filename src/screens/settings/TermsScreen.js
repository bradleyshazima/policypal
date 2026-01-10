import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function TermsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last updated: January 10, 2026</Text>
      </View>

      <Section title="1. Acceptance of Terms">
        <Text style={styles.paragraph}>
          By accessing and using PolicyPal ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
        </Text>
      </Section>

      <Section title="2. Description of Service">
        <Text style={styles.paragraph}>
          PolicyPal provides an insurance reminder and client management platform for insurance agents. The Service allows users to manage client information, schedule automated reminders, and track policy renewals.
        </Text>
      </Section>

      <Section title="3. User Accounts">
        <Text style={styles.paragraph}>
          To use certain features of the Service, you must register for an account. You agree to:
        </Text>
        <BulletPoint text="Provide accurate and complete information" />
        <BulletPoint text="Maintain the security of your password" />
        <BulletPoint text="Accept responsibility for all activities under your account" />
        <BulletPoint text="Notify us immediately of any unauthorized use" />
      </Section>

      <Section title="4. Subscription and Payments">
        <Text style={styles.paragraph}>
          The Service is offered on a subscription basis with a 7-day free trial. After the trial period:
        </Text>
        <BulletPoint text="You will be charged according to your selected plan" />
        <BulletPoint text="Subscriptions automatically renew unless cancelled" />
        <BulletPoint text="Refunds are available within 14 days of payment" />
        <BulletPoint text="SMS charges are separate and based on usage" />
      </Section>

      <Section title="5. User Content and Data">
        <Text style={styles.paragraph}>
          You retain all rights to the data you upload to the Service. By using the Service, you grant us a license to store, process, and display your data solely for the purpose of providing the Service.
        </Text>
        <Text style={styles.paragraph}>
          You are responsible for:
        </Text>
        <BulletPoint text="The accuracy of client information" />
        <BulletPoint text="Obtaining necessary consents for client data" />
        <BulletPoint text="Complying with data protection regulations" />
        <BulletPoint text="Maintaining backups of your data" />
      </Section>

      <Section title="6. Acceptable Use">
        <Text style={styles.paragraph}>
          You agree not to:
        </Text>
        <BulletPoint text="Use the Service for any illegal purpose" />
        <BulletPoint text="Send spam or unsolicited messages" />
        <BulletPoint text="Interfere with the Service's operation" />
        <BulletPoint text="Attempt to gain unauthorized access" />
        <BulletPoint text="Violate any applicable laws or regulations" />
      </Section>

      <Section title="7. SMS and Communication Services">
        <Text style={styles.paragraph}>
          SMS and WhatsApp services are subject to carrier availability and rates. We are not responsible for:
        </Text>
        <BulletPoint text="Message delivery failures" />
        <BulletPoint text="Carrier fees or charges" />
        <BulletPoint text="Content of messages sent through the Service" />
      </Section>

      <Section title="8. Intellectual Property">
        <Text style={styles.paragraph}>
          The Service and its original content, features, and functionality are owned by PolicyPal and are protected by international copyright, trademark, and other intellectual property laws.
        </Text>
      </Section>

      <Section title="9. Limitation of Liability">
        <Text style={styles.paragraph}>
          PolicyPal shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
        </Text>
      </Section>

      <Section title="10. Termination">
        <Text style={styles.paragraph}>
          We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
        </Text>
      </Section>

      <Section title="11. Changes to Terms">
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. We will notify users of any material changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance of the new terms.
        </Text>
      </Section>

      <Section title="12. Governing Law">
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
        </Text>
      </Section>

      <Section title="13. Contact Information">
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at:
        </Text>
        <Text style={styles.contactInfo}>Email: legal@policypal.com</Text>
        <Text style={styles.contactInfo}>Phone: +254 700 123 456</Text>
        <Text style={styles.contactInfo}>Address: Nairobi, Kenya</Text>
      </Section>

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
});