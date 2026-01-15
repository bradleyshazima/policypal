import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const FAQS = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I add my first client?',
    answer: 'Navigate to the Clients tab and tap the + button. Fill in the client details including their name, contact info, vehicle information, and insurance details. You can also set up automatic reminders for each client.',
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'How do I set up automatic reminders?',
    answer: 'When adding or editing a client, scroll to the Reminder Settings section. Check the boxes for when you want reminders sent (e.g., 15 days, 10 days, 5 days before expiry). You can also customize the message template.',
  },
  {
    id: '3',
    category: 'Billing & Subscription',
    question: 'What happens when my trial ends?',
    answer: 'After your 7-day trial ends, you\'ll need to upgrade to a paid plan to continue using the app. You can choose from Basic, Professional, or Enterprise plans based on your needs.',
  },
  {
    id: '4',
    category: 'Billing & Subscription',
    question: 'Can I change my subscription plan?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time from Settings > Subscription. Changes take effect immediately, and you\'ll be charged or credited the difference.',
  },
  {
    id: '5',
    category: 'Billing & Subscription',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards (Visa, Mastercard), M-Pesa, and PayPal. You can manage your payment methods in Settings > Billing Information.',
  },
  {
    id: '6',
    category: 'Reminders & Messages',
    question: 'How much does it cost to send SMS reminders?',
    answer: 'SMS costs vary by plan. Basic plan includes 200 SMS/month, Professional includes 1,000 SMS/month. Additional SMS are charged at approximately $0.05 per message.',
  },
  {
    id: '7',
    category: 'Reminders & Messages',
    question: 'Can I send reminders via WhatsApp?',
    answer: 'Yes! WhatsApp integration is available on the Professional and Enterprise plans. You can set WhatsApp as your default delivery method in Settings.',
  },
  {
    id: '8',
    category: 'Reminders & Messages',
    question: 'Can I customize reminder messages?',
    answer: 'Absolutely! Go to Settings > Message Templates to create custom templates. You can use variables like {client_name}, {car_model}, and {renewal_date} to personalize messages.',
  },
  {
    id: '9',
    category: 'Account & Security',
    question: 'How do I change my password?',
    answer: 'Go to Settings > Change Password. Enter your current password and your new password twice to confirm. Make sure your new password is strong and secure.',
  },
  {
    id: '10',
    category: 'Account & Security',
    question: 'Is my data secure?',
    answer: 'Yes! We use industry-standard encryption to protect your data. All payment information is securely processed and we never store your full credit card details.',
  },
  {
    id: '11',
    category: 'Features',
    question: 'Can I export my client data?',
    answer: 'Yes! From the Reports screen, you can export your data as PDF or Excel files. This includes client lists, payment history, and analytics.',
  },
  {
    id: '12',
    category: 'Features',
    question: 'Can multiple agents use one account?',
    answer: 'Multi-agent support is available on the Enterprise plan. Each agent can have their own login while sharing the same client database.',
  },
];

export default function FAQsScreen() {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(FAQS.map(faq => faq.category))];

  const filteredFAQs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Octicons name="search" size={16} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Octicons name="x" size={16} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQs List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredFAQs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqItem}
            onPress={() => toggleExpand(faq.id)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <View style={styles.faqHeaderLeft}>
                <View style={styles.iconContainer}>
                  <Octicons name="question" size={16} color={COLORS.blue} />
                </View>
                <Text style={styles.question}>{faq.question}</Text>
              </View>
              <Octicons
                name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.gray}
              />
            </View>

            {expandedId === faq.id && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{faq.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredFAQs.length === 0 && (
          <View style={styles.emptyState}>
            <Octicons name="search" size={64} color={COLORS.gray} opacity={0.5} />
            <Text style={styles.emptyTitle}>No FAQs Found</Text>
            <Text style={styles.emptyMessage}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Contact Support Button */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Still need help?</Text>
        <TouchableOpacity style={styles.supportButton}>
          <Octicons name="mail" size={16} color={COLORS.white} />
          <Text style={styles.supportButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  categoriesContainer: {
    marginBottom: 16,
    minHeight: 32,
    maxHeight: 32,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: COLORS.blue,
  },
  categoryText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  faqItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  question: {
    flex: 1,
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
    lineHeight: 20,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
  },
  answer: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
  footer: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 12,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  supportButtonText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});