import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../constants/theme';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Card */}
      <View style={[styles.welcomeCard, styles.shadow]}>
        <View style={styles.welcomeContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeLabel}>Welcome Back!</Text>
            <Text style={styles.welcomeName}>Bradley</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => navigation.navigate('Notifications')}
        >
          <Octicons name='bell' size={22} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <Text style={styles.sectionSubtitle}>Past 30 days</Text>
      </View>

      <View style={styles.statsContainer}>
        {/* Total Clients Card */}
        <View style={[styles.statCard, styles.shadow]}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.accent + '15' }]}>
              <Octicons name='people' size={16} color={COLORS.blue} />
            </View>
            <Text style={styles.statLabel}>Total Clients</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>28</Text>
            <View style={styles.statChange}>
              <Octicons name='triangle-up' size={16} color={COLORS.success} />
              <Text style={[styles.statChangeText, { color: COLORS.success }]}>+50%</Text>
            </View>
          </View>
        </View>

        {/* Active Policies Card */}
        <View style={[styles.statCard, styles.shadow]}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.warning + '15' }]}>
              <Octicons name='checklist' size={16} color={COLORS.warning} />
            </View>
            <Text style={styles.statLabel}>Active Policies</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>19</Text>
            <View style={styles.statChange}>
              <Octicons name='triangle-down' size={16} color={COLORS.danger} />
              <Text style={[styles.statChangeText, { color: COLORS.danger }]}>-28%</Text>
            </View>
          </View>
        </View>

        {/* Reminders Sent Card */}
        <View style={[styles.statCard, styles.shadow]}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.success + '15' }]}>
              <Octicons name='megaphone' size={16} color={COLORS.success} />
            </View>
            <Text style={styles.statLabel}>Reminders Sent</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>24</Text>
            <View style={styles.statChange}>
              <Octicons name='triangle-up' size={16} color={COLORS.success} />
              <Text style={[styles.statChangeText, { color: COLORS.success }]}>+50%</Text>
            </View>
          </View>
        </View>

        {/* Due Renewals Card */}
        <View style={[styles.statCard, styles.shadow]}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.danger + '15' }]}>
              <Octicons name='stopwatch' size={16} color={COLORS.danger} />
            </View>
            <Text style={styles.statLabel}>Due Renewals</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>19</Text>
            <View style={styles.statChange}>
              <Octicons name='triangle-up' size={16} color={COLORS.success} />
              <Text style={[styles.statChangeText, { color: COLORS.success }]}>+50%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={[styles.actionCard, styles.shadow]} 
          onPress={() => navigation.navigate('ClientsTab', { screen: 'AddClient' })}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: COLORS.accent + '15' }]}>
            <Octicons name='person-add' size={24} color={COLORS.blue} />
          </View>
          <Text style={styles.actionLabel}>Add Client</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, styles.shadow]}
          onPress={() => navigation.navigate('RemindersTab', { screen: 'SendReminder' })}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: COLORS.success + '15' }]}>
            <FontAwesome name='send' size={22} color={COLORS.success} />
          </View>
          <Text style={styles.actionLabel}>Send Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, styles.shadow]} 
          onPress={() => navigation.navigate('Reports')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: COLORS.warning + '15' }]}>
            <Octicons name='graph' size={24} color={COLORS.warning} />
          </View>
          <Text style={styles.actionLabel}>View Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>

      <View style={[styles.activityContainer, styles.shadow]}>
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Reminder sent to <Text style={styles.activityBold}>John Kinyua</Text>
              {' '}<Text style={styles.activityPlate}>KDC 204D</Text>
            </Text>
            <Text style={styles.activityTime}>12:17</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: COLORS.danger }]} />
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: COLORS.danger }]}>
              Send reminder failed: <Text style={styles.activityBold}>Brandon Ogola</Text>
            </Text>
            <Text style={styles.activityTime}>12:15</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: COLORS.success }]} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Added new client: <Text style={styles.activityBold}>Danford Kweli</Text>
            </Text>
            <Text style={styles.activityTime}>12:00</Text>
          </View>
        </View>

        <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
          <View style={[styles.activityDot, { backgroundColor: COLORS.primary }]} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Policy renewed: <Text style={styles.activityBold}>Henry Shikoli</Text>
            </Text>
            <Text style={styles.activityTime}>11:45</Text>
          </View>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },

  // Welcome Card Styles
  welcomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Bold',
    color: COLORS.white,
  },
  welcomeTextContainer: {
    justifyContent: 'center',
  },
  welcomeLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  welcomeName: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.text,
    marginTop: 2,
  },
  notificationButton: {
    padding: 12,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
  },

  // Section Header Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },

  // Stats Container Styles
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.gray,
    flex: 1,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Bold',
    color: COLORS.text,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statChangeText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
  },

  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    gap: 12,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.text,
    textAlign: 'center',
  },

  // Recent Activity Styles
  activityContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  activityBold: {
    fontFamily: 'SemiBold',
    color: COLORS.text,
  },
  activityPlate: {
    fontFamily: 'SemiBold',
    color: COLORS.gray,
  },
  activityTime: {
    fontFamily: 'Regular',
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
    marginLeft: 8,
  },

  // Shadow Styles
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});