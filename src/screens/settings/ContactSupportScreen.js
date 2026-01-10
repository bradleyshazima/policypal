import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const SUPPORT_OPTIONS = [
  {
    id: 'email',
    icon: 'mail',
    title: 'Email Support',
    description: 'Get help via email',
    value: 'support@policypal.com',
    action: 'email',
  },
  {
    id: 'phone',
    icon: 'device-mobile',
    title: 'Phone Support',
    description: 'Call us directly',
    value: '+254 700 123 456',
    action: 'call',
  },
  {
    id: 'whatsapp',
    icon: 'comment-discussion',
    title: 'WhatsApp',
    description: 'Chat with us on WhatsApp',
    value: '+254 700 123 456',
    action: 'whatsapp',
  },
  {
    id: 'website',
    icon: 'globe',
    title: 'Help Center',
    description: 'Visit our help center',
    value: 'www.policypal.com/help',
    action: 'web',
  },
];

const ISSUE_CATEGORIES = [
  'Technical Issue',
  'Billing Question',
  'Feature Request',
  'Bug Report',
  'General Inquiry',
  'Other',
];

export default function ContactSupportScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleContact = (option) => {
    switch (option.action) {
      case 'email':
        Linking.openURL(`mailto:${option.value}`);
        break;
      case 'call':
        Linking.openURL(`tel:${option.value}`);
        break;
      case 'whatsapp':
        Linking.openURL(`whatsapp://send?phone=${option.value.replace(/\s/g, '')}`);
        break;
      case 'web':
        Linking.openURL(`https://${option.value}`);
        break;
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !category || !message) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowAlert(true);
      setName('');
      setEmail('');
      setCategory('');
      setMessage('');
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Info */}
      <View style={styles.headerCard}>
        <Octicons name="people" size={32} color={COLORS.blue} />
        <Text style={styles.headerTitle}>We're Here to Help</Text>
        <Text style={styles.headerDescription}>
          Our support team typically responds within 24 hours
        </Text>
      </View>

      {/* Quick Contact Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.optionsGrid}>
          {SUPPORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleContact(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Octicons name={option.icon} size={24} color={COLORS.blue} />
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
              <Text style={styles.optionValue}>{option.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Support Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Us a Message</Text>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.gray}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Issue Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {ISSUE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your issue or question..."
              placeholderTextColor={COLORS.gray}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{message.length} / 500</Text>
          </View>

          <Button
            title="Send Message"
            onPress={handleSubmit}
            loading={loading}
            disabled={!name || !email || !category || !message}
          />
        </View>
      </View>

      {/* Support Hours */}
      <View style={styles.hoursCard}>
        <Octicons name="clock" size={20} color={COLORS.blue} />
        <View style={styles.hoursContent}>
          <Text style={styles.hoursTitle}>Support Hours</Text>
          <Text style={styles.hoursText}>Monday - Friday: 9:00 AM - 6:00 PM EAT</Text>
          <Text style={styles.hoursText}>Saturday: 10:00 AM - 4:00 PM EAT</Text>
          <Text style={styles.hoursText}>Sunday: Closed</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />

      <Alert
        visible={showAlert}
        title="Message Sent"
        message="Thank you for contacting us. We'll get back to you within 24 hours."
        type="success"
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
    padding: 16,
  },
  headerCard: {
    backgroundColor: COLORS.accent,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.blue,
    marginTop: 12,
    marginBottom: 8,
  },
  headerDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.blue,
    textAlign: 'center',
    opacity: 0.8,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  optionDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  categoryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  categoryChipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  categoryText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  characterCount: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
  },
  hoursCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  hoursContent: {
    flex: 1,
  },
  hoursTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
  },
  hoursText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginBottom: 4,
  },
});