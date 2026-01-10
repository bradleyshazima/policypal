import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function AboutAppScreen() {
  const appVersion = '1.0.0';
  const buildNumber = '100';

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* App Icon and Name */}
      <View style={styles.header}>
        <View style={styles.appIcon}>
          <Octicons name="bell" size={48} color={COLORS.blue} />
        </View>
        <Text style={styles.appName}>PolicyPal</Text>
        <Text style={styles.tagline}>Insurance Reminder & Client Management</Text>
        <Text style={styles.version}>Version {appVersion} (Build {buildNumber})</Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About PolicyPal</Text>
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            PolicyPal is a comprehensive insurance management platform designed specifically for insurance agents. Our mission is to help agents never miss a client renewal and grow their business through automated reminders and efficient client management.
          </Text>
          <Text style={styles.paragraph}>
            Built with love by a team passionate about making insurance agents' lives easier, PolicyPal combines powerful automation with an intuitive interface to help you focus on what matters most - serving your clients.
          </Text>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.card}>
          <FeatureItem
            icon="people"
            title="Client Management"
            description="Organize and manage all your clients in one place"
          />
          <FeatureItem
            icon="clock"
            title="Automated Reminders"
            description="Set it and forget it - we'll notify your clients"
          />
          <FeatureItem
            icon="device-mobile"
            title="Multi-Channel"
            description="Send reminders via SMS, WhatsApp, or Email"
          />
          <FeatureItem
            icon="graph"
            title="Analytics"
            description="Track performance and client retention"
          />
          <FeatureItem
            icon="shield"
            title="Secure & Reliable"
            description="Bank-level encryption to protect your data"
          />
        </View>
      </View>

      {/* Team */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            PolicyPal is developed and maintained by a dedicated team of developers, designers, and insurance industry experts committed to creating the best tools for insurance professionals.
          </Text>
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Us</Text>
        <View style={styles.card}>
          <LinkItem
            icon="globe"
            label="Website"
            value="www.policypal.com"
            onPress={() => handleLinkPress('https://www.policypal.com')}
          />
          <LinkItem
            icon="mail"
            label="Email"
            value="hello@policypal.com"
            onPress={() => handleLinkPress('mailto:hello@policypal.com')}
          />
          <LinkItem
            icon="mark-github"
            label="GitHub"
            value="github.com/policypal"
            onPress={() => handleLinkPress('https://github.com/policypal')}
          />
          <LinkItem
            icon="comment-discussion"
            label="Twitter"
            value="@policypal"
            onPress={() => handleLinkPress('https://twitter.com/policypal')}
          />
        </View>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.card}>
          <Text style={styles.legalText}>© 2026 PolicyPal. All rights reserved.</Text>
          <Text style={styles.legalText}>
            PolicyPal is a trademark of UG Labs Limited.
          </Text>
          <Text style={styles.legalText}>
            Made with ❤️ in Nairobi, Kenya
          </Text>
        </View>
      </View>

      {/* Credits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acknowledgments</Text>
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            Special thanks to our beta testers, early adopters, and the insurance agent community for their invaluable feedback and support.
          </Text>
          <Text style={styles.paragraph}>
            Built with React Native, powered by Expo, and various open-source libraries that make this app possible.
          </Text>
        </View>
      </View>

      {/* System Info */}
      <View style={styles.systemInfo}>
        <SystemInfoRow label="App Version" value={appVersion} />
        <SystemInfoRow label="Build Number" value={buildNumber} />
        <SystemInfoRow label="Platform" value="iOS / Android" />
        <SystemInfoRow label="Last Updated" value="Jan 10, 2026" />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Octicons name={icon} size={20} color={COLORS.blue} />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const LinkItem = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.linkItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.linkLeft}>
      <Octicons name={icon} size={18} color={COLORS.blue} />
      <View>
        <Text style={styles.linkLabel}>{label}</Text>
        <Text style={styles.linkValue}>{value}</Text>
      </View>
    </View>
    <Octicons name="link-external" size={16} color={COLORS.gray} />
  </TouchableOpacity>
);

const SystemInfoRow = ({ label, value }) => (
  <View style={styles.systemInfoRow}>
    <Text style={styles.systemInfoLabel}>{label}</Text>
    <Text style={styles.systemInfoValue}>{value}</Text>
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
    alignItems: 'center',
    paddingVertical: 32,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontFamily: 'Bold',
    fontSize: SIZES.xlarge,
    color: COLORS.black,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
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
  paragraph: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 22,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    lineHeight: 18,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  linkLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  linkValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
    marginTop: 2,
  },
  legalText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 6,
  },
  systemInfo: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  systemInfoLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  systemInfoValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
});