import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Octicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useCallback } from 'react';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data in parallel
      const [clientsData, remindersData, subscriptionData] = await Promise.all([
        api.clients.getAll(),
        api.reminders.getStatistics(),
        api.subscription.getCurrent().catch(() => null),
      ]);

      // Get expiring clients (next 30 days)
      const expiringData = await api.clients.getExpiring(30);

      setStats({
        totalClients: clientsData.count || 0,
        activePolicies: clientsData.clients?.filter(c => c.status === 'active').length || 0,
        dueSoon: expiringData.count || 0,
        remindersSent: remindersData.statistics?.sent || 0,
      });

      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getDaysRemaining = () => {
    if (!subscription?.trial) return null;
    return subscription.trial.daysRemaining;
  };

  if (loading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const userName = user?.full_name?.split(' ')[0] || 'User';
  const daysRemaining = getDaysRemaining();
  const isOnTrial = subscription?.trial?.status === 'trial';

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
             <View style={styles.onlineDot} />
           </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ==================== TRIAL BANNER ==================== */}
        {isOnTrial && daysRemaining !== null && (
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
                <Text style={styles.trialSubtitle}>
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining. Upgrade now.
                </Text>
              </View>
            </View>
            <Octicons name="chevron-right" size={20} color={COLORS.white} style={{ opacity: 0.8 }} />
          </TouchableOpacity>
        )}

        {/* ==================== STATS OVERVIEW ==================== */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Octicons name="people" size={20} color={COLORS.blue} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats?.totalClients || 0}</Text>
              <Text style={styles.statLabel}>Total Clients</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Octicons name="shield-check" size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats?.activePolicies || 0}</Text>
              <Text style={styles.statLabel}>Active Policies</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Octicons name="stopwatch" size={20} color={COLORS.danger} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats?.dueSoon || 0}</Text>
              <Text style={styles.statLabel}>Due Soon</Text>
            </View>
            {stats?.dueSoon > 0 && <View style={styles.attentionDot} />}
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Octicons name="bell" size={20} color={COLORS.warning} />
            </View>
            <View>
              <Text style={styles.statValue}>{stats?.remindersSent || 0}</Text>
              <Text style={styles.statLabel}>Reminders Sent</Text>
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

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
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
  scrollContent: {
    padding: 16,
  },
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
    width: '48%',
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
  attentionDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
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
    borderRadius: 18,
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
});