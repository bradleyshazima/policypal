import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const PAYMENT_HISTORY = [
  {
    id: '1',
    date: 'Jan 1, 2026',
    amount: '$24.99',
    plan: 'Professional Plan',
    status: 'Completed',
    method: 'Credit Card',
    invoice: 'INV-2026-001',
  },
  {
    id: '2',
    date: 'Dec 1, 2025',
    amount: '$24.99',
    plan: 'Professional Plan',
    status: 'Completed',
    method: 'Credit Card',
    invoice: 'INV-2025-012',
  },
  {
    id: '3',
    date: 'Nov 1, 2025',
    amount: '$24.99',
    plan: 'Professional Plan',
    status: 'Completed',
    method: 'M-Pesa',
    invoice: 'INV-2025-011',
  },
  {
    id: '4',
    date: 'Oct 1, 2025',
    amount: '$9.99',
    plan: 'Basic Plan',
    status: 'Completed',
    method: 'Credit Card',
    invoice: 'INV-2025-010',
  },
  {
    id: '5',
    date: 'Sep 15, 2025',
    amount: '$9.99',
    plan: 'Basic Plan',
    status: 'Failed',
    method: 'Credit Card',
    invoice: 'INV-2025-009',
  },
];

export default function PaymentHistoryScreen() {
  const handleDownloadInvoice = (invoice) => {
    console.log('Downloading invoice:', invoice);
  };

  const totalPaid = PAYMENT_HISTORY.filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryValue}>${totalPaid.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Transactions</Text>
          <Text style={styles.summaryValue}>{PAYMENT_HISTORY.length}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PAYMENT_HISTORY.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View style={styles.paymentLeft}>
                <View
                  style={[
                    styles.statusBadge,
                    payment.status === 'Completed'
                      ? styles.completedBadge
                      : styles.failedBadge,
                  ]}
                >
                  <Octicons
                    name={payment.status === 'Completed' ? 'check-circle' : 'x-circle'}
                    size={14}
                    color={COLORS.white}
                  />
                  <Text style={styles.statusText}>{payment.status}</Text>
                </View>
                <Text style={styles.date}>{payment.date}</Text>
              </View>
              <Text style={styles.amount}>{payment.amount}</Text>
            </View>

            <View style={styles.paymentDetails}>
              <DetailRow icon="package" label="Plan" value={payment.plan} />
              <DetailRow icon="credit-card" label="Method" value={payment.method} />
              <DetailRow icon="file" label="Invoice" value={payment.invoice} />
            </View>

            {payment.status === 'Completed' && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownloadInvoice(payment.invoice)}
              >
                <Octicons name="download" size={16} color={COLORS.blue} />
                <Text style={styles.downloadText}>Download Invoice</Text>
              </TouchableOpacity>
            )}

            {payment.status === 'Failed' && (
              <TouchableOpacity style={styles.retryButton}>
                <Octicons name="sync" size={16} color={COLORS.white} />
                <Text style={styles.retryText}>Retry Payment</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {PAYMENT_HISTORY.length === 0 && (
          <View style={styles.emptyState}>
            <Octicons name="inbox" size={64} color={COLORS.gray} opacity={0.5} />
            <Text style={styles.emptyTitle}>No Payment History</Text>
            <Text style={styles.emptyMessage}>
              Your payment history will appear here
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <Octicons name={icon} size={14} color={COLORS.gray} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontFamily: 'Bold',
    fontSize: SIZES.xlarge,
    color: COLORS.white,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.white,
    opacity: 0.3,
    marginHorizontal: 20,
  },
  scrollContent: {
    padding: 16,
  },
  paymentCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  paymentLeft: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  completedBadge: {
    backgroundColor: COLORS.success,
  },
  failedBadge: {
    backgroundColor: COLORS.danger,
  },
  statusText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },
  date: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  amount: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.blue,
  },
  paymentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  detailValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  downloadText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.danger,
  },
  retryText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.white,
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
});