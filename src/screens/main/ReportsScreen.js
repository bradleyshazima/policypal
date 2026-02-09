import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { COLORS, SIZES } from '../../constants/theme';
import api from '../../services/api';

export default function ReportsScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('This Month');
  const [exporting, setExporting] = useState(false);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [clientsData, remindersData, statisticsData] = await Promise.all([
        api.clients.getAll(),
        api.reminders.getAll(),
        api.reminders.getStatistics(),
      ]);

      const clients = clientsData.clients || [];
      const reminders = remindersData.reminders || [];
      const statistics = statisticsData.statistics || {};

      // Calculate metrics
      const totalClients = clients.length;
      const activeClients = clients.filter(c => {
        if (!c.expiry_date) return false;
        const expiryDate = new Date(c.expiry_date);
        return expiryDate > new Date();
      }).length;

      const totalReminders = reminders.length;
      const sentReminders = reminders.filter(r => 
        r.status === 'sent' || r.status === 'delivered'
      ).length;
      const failedReminders = reminders.filter(r => r.status === 'failed').length;
      const successRate = totalReminders > 0 
        ? ((sentReminders / totalReminders) * 100).toFixed(1)
        : 0;

      // Upcoming expirations (next 30 days)
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const upcomingExpirations = clients.filter(c => {
        if (!c.expiry_date) return false;
        const expiryDate = new Date(c.expiry_date);
        return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
      }).length;

      // Delivery method breakdown
      const deliveryMethods = reminders.reduce((acc, r) => {
        const method = r.delivery_method || 'SMS';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalClients,
        activeClients,
        totalReminders,
        sentReminders,
        failedReminders,
        successRate,
        upcomingExpirations,
        deliveryMethods,
        clients,
        reminders,
      });
    } catch (error) {
      console.error('Fetch report data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReportData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportData();
  };

  const generateReportContent = () => {
    if (!stats) return '';

    const date = new Date().toLocaleDateString();
    
    return `
PolicyPal - Analytics Report
Generated: ${date}
Period: ${dateRange}

═══════════════════════════════════════════

CLIENT METRICS
─────────────────────────────────────────
Total Clients: ${stats.totalClients}
Active Policies: ${stats.activeClients}
Upcoming Renewals (30 days): ${stats.upcomingExpirations}

REMINDER METRICS
─────────────────────────────────────────
Total Reminders Sent: ${stats.totalReminders}
Successfully Delivered: ${stats.sentReminders}
Failed Deliveries: ${stats.failedReminders}
Success Rate: ${stats.successRate}%

DELIVERY METHODS
─────────────────────────────────────────
${Object.entries(stats.deliveryMethods)
  .map(([method, count]) => `${method}: ${count}`)
  .join('\n')}

═══════════════════════════════════════════

UPCOMING RENEWALS
─────────────────────────────────────────
${stats.clients
  .filter(c => {
    if (!c.expiry_date) return false;
    const expiryDate = new Date(c.expiry_date);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
  })
  .map(c => `• ${c.full_name} - Expires: ${new Date(c.expiry_date).toLocaleDateString()}`)
  .join('\n') || 'No upcoming renewals'}

═══════════════════════════════════════════
End of Report
    `.trim();
  };

  const generateCSVContent = () => {
    if (!stats) return '';

    const csvRows = [
      ['PolicyPal Analytics Report'],
      ['Generated:', new Date().toLocaleDateString()],
      ['Period:', dateRange],
      [''],
      ['SUMMARY METRICS'],
      ['Metric', 'Value'],
      ['Total Clients', stats.totalClients],
      ['Active Policies', stats.activeClients],
      ['Upcoming Renewals (30 days)', stats.upcomingExpirations],
      ['Total Reminders', stats.totalReminders],
      ['Successful Reminders', stats.sentReminders],
      ['Failed Reminders', stats.failedReminders],
      ['Success Rate', `${stats.successRate}%`],
      [''],
      ['DELIVERY METHODS'],
      ['Method', 'Count'],
      ...Object.entries(stats.deliveryMethods).map(([method, count]) => [method, count]),
    ];

    return csvRows.map(row => row.join(',')).join('\n');
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);

      const content = format === 'CSV' ? generateCSVContent() : generateReportContent();
      const extension = format === 'CSV' ? 'csv' : 'txt';
      const filename = `PolicyPal_Report_${new Date().getTime()}.${extension}`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, content);

      Alert.alert(
        'Export Complete',
        'How would you like to share the report?',
        [
          {
            text: 'Email',
            onPress: () => handleEmail(fileUri, filename),
          },
          {
            text: 'Download',
            onPress: () => handleDownload(fileUri),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const handleEmail = async (fileUri, filename) => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Error', 'Email is not available on this device');
        // Fallback to sharing
        await handleDownload(fileUri);
        return;
      }

      await MailComposer.composeAsync({
        subject: `PolicyPal Analytics Report - ${new Date().toLocaleDateString()}`,
        body: 'Please find attached the PolicyPal analytics report.',
        attachments: [fileUri],
      });
    } catch (error) {
      console.error('Email error:', error);
      Alert.alert('Error', 'Failed to send email. Opening share menu instead.');
      await handleDownload(fileUri);
    }
  };

  const handleDownload = async (fileUri) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      
      if (!canShare) {
        Alert.alert('Success', 'Report saved to device storage');
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Save Report',
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to save report');
    }
  };

  if (loading && !stats) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading report data...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load report data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Analytics Report</Text>
        </View>

        {/* Date Range Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRangeContent}
        >
          {['This Week', 'This Month', 'Last 3 Months', 'All Time'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.dateRangeChip,
                dateRange === range && styles.dateRangeChipActive,
              ]}
              onPress={() => setDateRange(range)}
            >
              <Text
                style={[
                  styles.dateRangeText,
                  dateRange === range && styles.dateRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ==================== KEY METRICS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              icon="people"
              label="Total Clients"
              value={stats.totalClients}
              color={COLORS.blue}
            />
            <MetricCard
              icon="shield-check"
              label="Active Policies"
              value={stats.activeClients}
              color={COLORS.success}
            />
            <MetricCard
              icon="paper-airplane"
              label="Reminders Sent"
              value={stats.totalReminders}
              color={COLORS.warning}
            />
            <MetricCard
              icon="check-circle"
              label="Success Rate"
              value={`${stats.successRate}%`}
              color={COLORS.success}
            />
          </View>
        </View>

        {/* ==================== UPCOMING RENEWALS ==================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Renewals</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{stats.upcomingExpirations}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.renewalPeriod}>
              <View style={styles.renewalInfo}>
                <View style={[styles.renewalDot, { backgroundColor: COLORS.danger }]} />
                <Text style={styles.renewalPeriodText}>Next 30 days</Text>
              </View>
              <Text style={styles.renewalCount}>{stats.upcomingExpirations} clients</Text>
            </View>
          </View>
        </View>

        {/* ==================== DELIVERY BREAKDOWN ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Methods</Text>

          <View style={styles.card}>
            {Object.entries(stats.deliveryMethods).map(([method, count]) => (
              <View key={method} style={styles.deliveryItem}>
                <View style={styles.deliveryInfo}>
                  <View style={styles.deliveryIcon}>
                    <Octicons 
                      name={method === 'SMS' ? 'device-mobile' : method === 'Email' ? 'mail' : 'bell'} 
                      size={16} 
                      color={COLORS.blue} 
                    />
                  </View>
                  <Text style={styles.deliveryMethod}>{method}</Text>
                </View>
                <Text style={styles.deliveryCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ==================== REMINDER STATUS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Performance</Text>

          <View style={styles.card}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceLabel}>
                <View style={[styles.performanceDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.performanceText}>Successful</Text>
              </View>
              <Text style={styles.performanceValue}>{stats.sentReminders}</Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={styles.performanceLabel}>
                <View style={[styles.performanceDot, { backgroundColor: COLORS.danger }]} />
                <Text style={styles.performanceText}>Failed</Text>
              </View>
              <Text style={styles.performanceValue}>{stats.failedReminders}</Text>
            </View>
            <View style={styles.performanceDivider} />
            <View style={styles.performanceItem}>
              <Text style={styles.performanceTotalLabel}>Success Rate</Text>
              <Text style={styles.performanceTotalValue}>{stats.successRate}%</Text>
            </View>
          </View>
        </View>

        {/* ==================== EXPORT OPTIONS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Report</Text>

          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport('TXT')}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator size="small" color={COLORS.blue} />
              ) : (
                <>
                  <Octicons name="file" size={24} color={COLORS.blue} />
                  <Text style={styles.exportButtonText}>Text Report</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport('CSV')}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator size="small" color={COLORS.blue} />
              ) : (
                <>
                  <Octicons name="table" size={24} color={COLORS.blue} />
                  <Text style={styles.exportButtonText}>CSV Data</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ==================== COMPONENTS ==================== */

const MetricCard = ({ icon, label, value, color }) => (
  <View style={styles.metricCard}>
    <View style={[styles.metricIcon, { backgroundColor: color + '15' }]}>
      <Octicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  centerContainer: {
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
  errorText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.danger,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  dateRangeContent: {
    gap: 8,
    paddingBottom: 4,
  },
  dateRangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  dateRangeChipActive: {
    backgroundColor: COLORS.blue,
  },
  dateRangeText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  dateRangeTextActive: {
    color: COLORS.white,
  },

  /* Content */
  content: {
    padding: 16,
  },

  /* Section */
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Bold',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },

  /* Metrics */
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontFamily: 'Bold',
    fontSize: SIZES.xlarge,
    color: COLORS.blue,
    marginBottom: 4,
  },
  metricLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    textAlign: 'center',
  },

  /* Card */
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },

  /* Renewals */
  renewalPeriod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  renewalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  renewalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  renewalPeriodText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  renewalCount: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },

  /* Delivery */
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryMethod: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  deliveryCount: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },

  /* Performance */
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  performanceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performanceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  performanceText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  performanceValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  performanceDivider: {
    height: 1,
    backgroundColor: COLORS.primary,
    marginVertical: 8,
  },
  performanceTotalLabel: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  performanceTotalValue: {
    fontFamily: 'Bold',
    fontSize: SIZES.medium,
    color: COLORS.success,
  },

  /* Export */
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  exportButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
    textAlign: 'center',
  },
});