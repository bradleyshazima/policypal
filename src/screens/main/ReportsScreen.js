import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { FontAwesome6, Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen({ navigation }) {
  const [dateRange, setDateRange] = useState('This Month');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleExport = (format) => {
    Alert.alert(
      'Export Report',
      `Export as ${format}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log(`Exporting as ${format}`) },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share Report',
      'Choose sharing method',
      [
        { text: 'Email', onPress: () => console.log('Share via email') },
        { text: 'Download', onPress: () => console.log('Download') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ==================== HEADER WITH DATE SELECTOR ==================== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Analytics Overview</Text>
          <TouchableOpacity onPress={handleShare}>
            <Octicons name="share" size={20} color={COLORS.blue} />
          </TouchableOpacity>
        </View>

        {/* Date Range Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateRangeContainer}
          contentContainerStyle={styles.dateRangeContent}
        >
          {['This Week', 'This Month', 'Last 3 Months', 'Custom'].map((range) => (
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
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== KEY METRICS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              icon="paper-airplane"
              label="Reminders Sent"
              value="1,245"
              change="+12%"
              changeType="positive"
            />
            <MetricCard
              icon="check-circle"
              label="Success Rate"
              value="94.5%"
              change="+2.3%"
              changeType="positive"
            />
            <MetricCard
              icon="people"
              label="Client Retention"
              value="87.2%"
              change="-1.5%"
              changeType="negative"
            />
            <MetricCard
              icon="graph"
              label="Revenue Tracked"
              value="$284K"
              change="+18%"
              changeType="positive"
            />
          </View>
        </View>

        {/* ==================== CHARTS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trends & Analysis</Text>

          {/* Reminders Sent Over Time */}
          <ChartCard
            title="Reminders Sent Over Time"
            subtitle="Last 7 days"
            icon="graph"
          >
            <LineChart />
          </ChartCard>

          {/* Reminder Types Breakdown */}
          <ChartCard
            title="Reminder Types"
            subtitle="Distribution by type"
            icon="pie-chart"
          >
            <PieChart />
          </ChartCard>

          {/* Client Acquisition */}
          <ChartCard
            title="Client Acquisition"
            subtitle="New clients per month"
            icon="trending-up"
          >
            <BarChart />
          </ChartCard>

          {/* Upcoming Renewals */}
          <ChartCard
            title="Upcoming Renewals"
            subtitle="Next 90 days"
            icon="calendar"
          >
            <UpcomingRenewals />
          </ChartCard>
        </View>

        {/* ==================== TOP CLIENTS ==================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Clients by Policy Value</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            <TopClientItem
              name="Brandon Ogola"
              policyValue="$12,500"
              rank={1}
            />
            <TopClientItem
              name="Sarah Wanjiru"
              policyValue="$9,800"
              rank={2}
            />
            <TopClientItem
              name="Kevin Otieno"
              policyValue="$8,200"
              rank={3}
            />
          </View>
        </View>

        {/* ==================== CLIENTS NEEDING ATTENTION ==================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Needs Attention</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>

          <View style={styles.listCard}>
            <AttentionClientItem
              name="Faith Busolo"
              reason="No contact in 45 days"
              urgency="high"
            />
            <AttentionClientItem
              name="Henry Shikoli"
              reason="Missed payment reminder"
              urgency="medium"
            />
            <AttentionClientItem
              name="Wycleff Jean"
              reason="Policy expires in 7 days"
              urgency="high"
            />
          </View>
        </View>

        {/* ==================== VEHICLE INSIGHTS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Vehicle Makes</Text>

          <View style={styles.listCard}>
            <VehicleMakeItem make="Toyota" count={45} percentage={32} />
            <VehicleMakeItem make="Nissan" count={28} percentage={20} />
            <VehicleMakeItem make="Honda" count={22} percentage={16} />
            <VehicleMakeItem make="Mazda" count={18} percentage={13} />
            <VehicleMakeItem make="Others" count={27} percentage={19} />
          </View>
        </View>

        {/* ==================== EXPORT OPTIONS ==================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Report</Text>

          <View style={styles.exportButtons}>
            <ExportButton
              icon="file-pdf"
              label="PDF"
              onPress={() => handleExport('PDF')}
            />
            <ExportButton
              icon="file-excel"
              label="Excel"
              onPress={() => handleExport('Excel')}
            />
            <ExportButton
              icon="mail"
              label="Email"
              onPress={handleShare}
            />
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ==================== COMPONENTS ==================== */

const MetricCard = ({ icon, label, value, change, changeType }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <View style={styles.metricIcon}>
        <Octicons name={icon} size={16} color={COLORS.blue} />
      </View>
      <View style={[
        styles.changeIndicator,
        changeType === 'positive' ? styles.changePositive : styles.changeNegative,
      ]}>
        <Octicons
          name={changeType === 'positive' ? 'arrow-up' : 'arrow-down'}
          size={10}
          color={COLORS.white}
        />
        <Text style={styles.changeText}>{change}</Text>
      </View>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const ChartCard = ({ title, subtitle, icon, children }) => (
  <View style={styles.chartCard}>
    <View style={styles.chartHeader}>
      <View>
        <Text style={styles.chartTitle}>{title}</Text>
        <Text style={styles.chartSubtitle}>{subtitle}</Text>
      </View>
      <Octicons name={icon} size={20} color={COLORS.blue} />
    </View>
    <View style={styles.chartContent}>
      {children}
    </View>
  </View>
);

/* Mock Chart Components */
const LineChart = () => (
  <View style={styles.mockChart}>
    <View style={styles.chartLine}>
      {[40, 65, 55, 80, 70, 90, 85].map((height, index) => (
        <View key={index} style={styles.chartBarContainer}>
          <View
            style={[
              styles.chartPoint,
              { height: `${height}%` }
            ]}
          />
        </View>
      ))}
    </View>
    <View style={styles.chartLabels}>
      <Text style={styles.chartLabel}>Mon</Text>
      <Text style={styles.chartLabel}>Tue</Text>
      <Text style={styles.chartLabel}>Wed</Text>
      <Text style={styles.chartLabel}>Thu</Text>
      <Text style={styles.chartLabel}>Fri</Text>
      <Text style={styles.chartLabel}>Sat</Text>
      <Text style={styles.chartLabel}>Sun</Text>
    </View>
  </View>
);

const PieChart = () => (
  <View style={styles.pieChartContainer}>
    <View style={styles.pieChart}>
      <View style={[styles.pieSlice, styles.slice1]} />
      <View style={[styles.pieSlice, styles.slice2]} />
      <View style={[styles.pieSlice, styles.slice3]} />
    </View>
    <View style={styles.pieLegend}>
      <LegendItem color={COLORS.blue} label="15-day reminder" value="45%" />
      <LegendItem color={COLORS.warning} label="7-day reminder" value="30%" />
      <LegendItem color={COLORS.success} label="Expiry alert" value="25%" />
    </View>
  </View>
);

const BarChart = () => (
  <View style={styles.mockChart}>
    <View style={styles.barChartContainer}>
      {[60, 75, 55, 85, 70, 90].map((height, index) => (
        <View key={index} style={styles.barWrapper}>
          <View
            style={[
              styles.bar,
              { height: `${height}%` }
            ]}
          />
        </View>
      ))}
    </View>
    <View style={styles.chartLabels}>
      <Text style={styles.chartLabel}>Jan</Text>
      <Text style={styles.chartLabel}>Feb</Text>
      <Text style={styles.chartLabel}>Mar</Text>
      <Text style={styles.chartLabel}>Apr</Text>
      <Text style={styles.chartLabel}>May</Text>
      <Text style={styles.chartLabel}>Jun</Text>
    </View>
  </View>
);

const UpcomingRenewals = () => (
  <View style={styles.renewalsContainer}>
    <RenewalPeriod period="0-30 days" count={12} color={COLORS.danger} />
    <RenewalPeriod period="31-60 days" count={18} color={COLORS.warning} />
    <RenewalPeriod period="61-90 days" count={24} color={COLORS.success} />
  </View>
);

const RenewalPeriod = ({ period, count, color }) => (
  <View style={styles.renewalPeriod}>
    <View style={styles.renewalInfo}>
      <View style={[styles.renewalDot, { backgroundColor: color }]} />
      <Text style={styles.renewalPeriodText}>{period}</Text>
    </View>
    <Text style={styles.renewalCount}>{count} clients</Text>
  </View>
);

const LegendItem = ({ color, label, value }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
    <Text style={styles.legendValue}>{value}</Text>
  </View>
);

const TopClientItem = ({ name, policyValue, rank }) => (
  <View style={styles.listItem}>
    <View style={styles.listItemLeft}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <Text style={styles.listItemName}>{name}</Text>
    </View>
    <Text style={styles.listItemValue}>{policyValue}</Text>
  </View>
);

const AttentionClientItem = ({ name, reason, urgency }) => (
  <View style={styles.listItem}>
    <View style={styles.listItemLeft}>
      <View style={[
        styles.urgencyDot,
        urgency === 'high' ? styles.urgencyHigh : styles.urgencyMedium,
      ]} />
      <View>
        <Text style={styles.listItemName}>{name}</Text>
        <Text style={styles.listItemReason}>{reason}</Text>
      </View>
    </View>
    <Octicons name="chevron-right" size={16} color={COLORS.gray} />
  </View>
);

const VehicleMakeItem = ({ make, count, percentage }) => (
  <View style={styles.vehicleItem}>
    <View style={styles.vehicleInfo}>
      <Text style={styles.vehicleMake}>{make}</Text>
      <Text style={styles.vehicleCount}>{count} vehicles</Text>
    </View>
    <View style={styles.vehicleBar}>
      <View style={[styles.vehicleBarFill, { width: `${percentage}%` }]} />
    </View>
    <Text style={styles.vehiclePercentage}>{percentage}%</Text>
  </View>
);

const ExportButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.exportButton} onPress={onPress}>
    <FontAwesome6 name={icon} size={24} color={COLORS.blue} />
    <Text style={styles.exportButtonText}>{label}</Text>
  </TouchableOpacity>
);

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  dateRangeContainer: {
    marginHorizontal: -16,
  },
  dateRangeContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dateRangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    marginRight: 8,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
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
  },
  viewAllText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
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
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  changePositive: {
    backgroundColor: COLORS.success,
  },
  changeNegative: {
    backgroundColor: COLORS.danger,
  },
  changeText: {
    fontFamily: 'Bold',
    fontSize: 10,
    color: COLORS.white,
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
  },

  /* Charts */
  chartCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 2,
  },
  chartSubtitle: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  chartContent: {
    minHeight: 150,
  },

  /* Mock Charts */
  mockChart: {
    height: 150,
  },
  chartLine: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartPoint: {
    width: 6,
    backgroundColor: COLORS.blue,
    borderRadius: 3,
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: COLORS.blue,
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontFamily: 'Regular',
    fontSize: 10,
    color: COLORS.gray,
  },

  /* Pie Chart */
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  slice1: {
    backgroundColor: COLORS.blue,
  },
  slice2: {
    backgroundColor: COLORS.warning,
    width: '60%',
    left: '40%',
  },
  slice3: {
    backgroundColor: COLORS.success,
    width: '30%',
    left: '70%',
  },
  pieLegend: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.black,
  },
  legendValue: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },

  /* Renewals */
  renewalsContainer: {
    gap: 12,
  },
  renewalPeriod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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

  /* Lists */
  listCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: 'Bold',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  listItemName: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  listItemValue: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  listItemReason: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyHigh: {
    backgroundColor: COLORS.danger,
  },
  urgencyMedium: {
    backgroundColor: COLORS.warning,
  },

  /* Vehicle */
  vehicleItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vehicleMake: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  vehicleCount: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  vehicleBar: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    marginBottom: 4,
  },
  vehicleBarFill: {
    height: '100%',
    backgroundColor: COLORS.blue,
    borderRadius: 3,
  },
  vehiclePercentage: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
    alignSelf: 'flex-end',
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
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  exportButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
});