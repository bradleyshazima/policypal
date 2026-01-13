import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Octicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';

export default function DashboardScreen() {
  const navigation = useNavigation();

  // Mock Data
  const userName = "Bradley";
  const notificationCount = 3;
  
  return (
    <View style={styles.container}>
      {/* Custom Header Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <Text style={styles.headerTitle}>Hello, {userName} 👋</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('SettingsTab', { screen: 'Profile' })}
        >
           <View style={styles.avatarContainer}>
             <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
             {/* Online Status Dot */}
             <View style={styles.onlineDot} />
           </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== TRIAL BANNER (Connects to Subscription Screen) ==================== */}
        <TouchableOpacity 
          style={styles.trialBanner}
          onPress={() => navigation.navigate('SettingsTab', { screen: 'Subscription' })}
          activeOpacity={0.9}
        >
          <View style={styles.trialContent}>
            <View style={styles.trialIcon}>
              <Octicons name="diamond" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.trialTitle}>Premium Trial Active</Text>
              <Text style={styles.trialSubtitle}>5 days remaining. Upgrade now.</Text>
            </View>
          </View>
          <Octicons name="chevron-right" size={20} color={COLORS.white} style={{ opacity: 0.8 }} />
        </TouchableOpacity>

        {/* ==================== STATS OVERVIEW ==================== */}
        <View style={styles.statsGrid}>
          {/* Total Clients */}
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Octicons name="people" size={20} color={COLORS.blue} />
            </View>
            <View>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Total Clients</Text>
            </View>
            <View style={styles.trendBadge}>
              <Octicons name="arrow-up" size={12} color={COLORS.success} />
              <Text style={styles.trendText}>12%</Text>
            </View>
          </View>

          {/* Active Policies */}
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Octicons name="shield-check" size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.statValue}>19</Text>
              <Text style={styles.statLabel}>Active Policies</Text>
            </View>
          </View>

          {/* Due Renewals */}
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Octicons name="stopwatch" size={20} color={COLORS.danger} />
            </View>
            <View>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Due Soon</Text>
            </View>
             {/* Attention Dot */}
             <View style={styles.attentionDot} />
          </View>

          {/* Pending Reminders */}
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Octicons name="bell" size={20} color={COLORS.warning} />
            </View>
            <View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Reminders</Text>
            </View>
          </View>
        </View>

        {/* ==================== QUICK ACTIONS ==================== */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <ActionButton 
            icon="person-add" 
            label="Add Client" 
            color={COLORS.blue}
            onPress={() => navigation.navigate('ClientsTab', { screen: 'AddClient' })} 
          />
          <ActionButton 
            icon="paper-airplane" 
            label="Send Msg" 
            color={COLORS.success}
            onPress={() => navigation.navigate('RemindersTab', { screen: 'SendReminder' })} 
          />
          <ActionButton 
            icon="graph" 
            label="Reports" 
            color={COLORS.warning}
            onPress={() => navigation.navigate('Reports')} 
          />
          <ActionButton 
            icon="bell" 
            label="Notifications" 
            color={COLORS.gray}
            onPress={() => navigation.navigate('Notifications')} 
          />
        </View>

        {/* ==================== RECENT ACTIVITY ==================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => console.log("View All")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          <ActivityItem 
            icon="mail" 
            title="Reminder Sent" 
            subtitle="To John Kinyua (KDC 204D)" 
            time="12:17 PM"
            status="success"
          />
          <ActivityItem 
            icon="alert" 
            title="Delivery Failed" 
            subtitle="To Brandon Ogola" 
            time="10:30 AM"
            status="failed"
          />
          <ActivityItem 
            icon="check-circle" 
            title="Policy Renewed" 
            subtitle="Henry Shikoli confirmed" 
            time="Yesterday"
            status="success"
          />
          <ActivityItem 
            icon="person" 
            title="New Client Added" 
            subtitle="Danford Kweli" 
            time="Yesterday"
            status="neutral"
            isLast
          />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

/* ==================== SUB-COMPONENTS ==================== */

const ActionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.actionIconBox, { backgroundColor: color + '15' }]}>
      <Octicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const ActivityItem = ({ icon, title, subtitle, time, status, isLast }) => {
  let iconColor = COLORS.blue;
  let bg = COLORS.accent;
  
  if (status === 'success') { iconColor = COLORS.success; bg = 'rgba(16, 185, 129, 0.1)'; }
  if (status === 'failed') { iconColor = COLORS.danger; bg = 'rgba(239, 68, 68, 0.1)'; }
  if (status === 'neutral') { iconColor = COLORS.blue; bg = 'rgba(59, 130, 246, 0.1)'; }

  return (
    <View style={[styles.activityItem, !isLast && styles.activityBorder]}>
      <View style={[styles.activityIcon, { backgroundColor: bg }]}>
        <Octicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
};

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Matches Settings Screen background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerDate: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large + 2,
    color: COLORS.black,
    marginTop: 4,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontFamily: 'Bold',
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  /* Trial Banner */
  trialBanner: {
    backgroundColor: COLORS.black,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  trialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trialIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  trialSubtitle: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: '#CCC',
  },

  /* Stats Grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: '48%', // Approx half width
    minHeight: 110,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontFamily: 'Bold',
    fontSize: 24,
    color: COLORS.black,
  },
  statLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  trendBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendText: {
    fontFamily: 'Bold',
    fontSize: 10,
    color: COLORS.success,
  },
  attentionDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },

  /* Quick Actions */
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
    width: '23%',
  },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18, // Softer corners
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small - 1,
    color: COLORS.black,
    textAlign: 'center',
  },

  /* Recent Activity */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 8, // Padding inside the card container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  activitySubtitle: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  activityTime: {
    fontFamily: 'Medium',
    fontSize: 10,
    color: COLORS.gray,
  },

  /* Floating Action Button */
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});