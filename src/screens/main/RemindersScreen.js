import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert as RNAlert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import Alert from '../../components/common/Alert';
import api from '../../services/api';

export default function RemindersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await api.reminders.getAll();
      setReminders(data.reminders || []);
    } catch (error) {
      console.error('Fetch reminders error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to load reminders',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReminders();
  };

  const handleDelete = (reminderId, clientName) => {
    RNAlert.alert(
      'Delete Reminder',
      `Are you sure you want to delete this reminder for ${clientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(reminderId),
        },
      ]
    );
  };

  const confirmDelete = async (reminderId) => {
    try {
      await api.reminders.delete(reminderId);
      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Reminder deleted successfully',
      });
      setShowAlert(true);
      fetchReminders();
    } catch (error) {
      console.error('Delete reminder error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to delete reminder',
      });
      setShowAlert(true);
    }
  };

  const handleResend = async (reminderId) => {
    try {
      await api.reminders.resend(reminderId);
      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: 'Reminder sent successfully',
      });
      setShowAlert(true);
      fetchReminders();
    } catch (error) {
      console.error('Resend reminder error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to send reminder',
      });
      setShowAlert(true);
    }
  };

  const getFilteredReminders = () => {
    if (activeTab === 'All') return reminders;
    if (activeTab === 'Scheduled') {
      return reminders.filter(r => r.status === 'scheduled' || r.status === 'pending');
    }
    if (activeTab === 'Sent') {
      return reminders.filter(r => r.status === 'sent' || r.status === 'delivered');
    }
    if (activeTab === 'Failed') {
      return reminders.filter(r => r.status === 'failed');
    }
    return reminders;
  };

  const filteredReminders = getFilteredReminders();

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return COLORS.success;
      case 'failed':
        return COLORS.danger;
      case 'scheduled':
      case 'pending':
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'failed':
        return 'Failed';
      case 'scheduled':
        return 'Scheduled';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading reminders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ---------- TOP TABS ---------- */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {['All', 'Scheduled', 'Sent', 'Failed'].map(tab => {
            const count = tab === 'All' 
              ? reminders.length 
              : tab === 'Scheduled'
              ? reminders.filter(r => r.status === 'scheduled' || r.status === 'pending').length
              : tab === 'Sent'
              ? reminders.filter(r => r.status === 'sent' || r.status === 'delivered').length
              : reminders.filter(r => r.status === 'failed').length;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {count > 0 && (
                  <View style={[
                    styles.tabBadge,
                    activeTab === tab && styles.tabBadgeActive
                  ]}>
                    <Text style={[
                      styles.tabBadgeText,
                      activeTab === tab && styles.tabBadgeTextActive
                    ]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ---------- LIST ---------- */}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredReminders}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <ReminderCard
            item={item}
            onDelete={() => handleDelete(item.id, item.client_name)}
            onResend={() => handleResend(item.id)}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Octicons name="bell-slash" size={64} color={COLORS.gray} opacity={0.5} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'All' ? 'No reminders yet' : `No ${activeTab.toLowerCase()} reminders`}
            </Text>
            <Text style={styles.emptyMessage}>
              Tap the + button to send your first reminder
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* ---------- FAB ---------- */}
      <TouchableOpacity
        style={[styles.fab, styles.shadow]}
        onPress={() => navigation.navigate('SendReminder')}
      >
        <Octicons name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="OK"
        onConfirm={() => setShowAlert(false)}
      />
    </View>
  );
}

/* ---------------- REMINDER CARD COMPONENT ---------------- */

const ReminderCard = ({ item, onDelete, onResend, getStatusColor, getStatusText, formatDate }) => {
  const statusColor = getStatusColor(item.status);
  const statusText = getStatusText(item.status);
  const isScheduled = item.status === 'scheduled' || item.status === 'pending';
  const isFailed = item.status === 'failed';
  const isSent = item.status === 'sent' || item.status === 'delivered';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.clientName}>{item.client_name || 'Unknown Client'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Octicons name="clock" size={14} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {item.scheduled_date 
              ? formatDate(item.scheduled_date) 
              : item.sent_at 
              ? formatDate(item.sent_at)
              : 'No date'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Octicons name="paper-airplane" size={14} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {item.delivery_method || 'SMS'}
          </Text>
        </View>
      </View>

      {/* Message Preview */}
      {item.message && (
        <Text style={styles.messagePreview} numberOfLines={2}>
          {item.message}
        </Text>
      )}

      {/* Failed Reason */}
      {isFailed && item.failure_reason && (
        <View style={styles.failureReason}>
          <Octicons name="alert" size={14} color={COLORS.danger} />
          <Text style={styles.failureText}>{item.failure_reason}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.cardActions}>
        {isScheduled && (
          <>
            <TouchableOpacity style={styles.actionButtonOutline}>
              <Octicons name="pencil" size={14} color={COLORS.blue} />
              <Text style={styles.actionButtonOutlineText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButtonOutline, styles.actionButtonDanger]}
              onPress={onDelete}
            >
              <Octicons name="trash" size={14} color={COLORS.danger} />
              <Text style={[styles.actionButtonOutlineText, { color: COLORS.danger }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        )}
        
        {isSent && (
          <TouchableOpacity 
            style={styles.actionButtonOutline}
            onPress={onResend}
          >
            <Octicons name="sync" size={14} color={COLORS.blue} />
            <Text style={styles.actionButtonOutlineText}>Resend</Text>
          </TouchableOpacity>
        )}
        
        {isFailed && (
          <>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onResend}
            >
              <Octicons name="sync" size={14} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButtonOutline, styles.actionButtonDanger]}
              onPress={onDelete}
            >
              <Octicons name="trash" size={14} color={COLORS.danger} />
              <Text style={[styles.actionButtonOutlineText, { color: COLORS.danger }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </>
        )}

        {!isScheduled && !isSent && !isFailed && (
          <TouchableOpacity 
            style={[styles.actionButtonOutline, styles.actionButtonDanger]}
            onPress={onDelete}
          >
            <Octicons name="trash" size={14} color={COLORS.danger} />
            <Text style={[styles.actionButtonOutlineText, { color: COLORS.danger }]}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/* ---------------- STYLES ---------------- */

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

  /* Tabs */
  tabsContainer: {
    backgroundColor: COLORS.lightGray,
    paddingTop: 8,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.blue,
  },
  tabText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  activeTabText: {
    fontFamily: 'Medium',
    color: COLORS.blue,
  },
  tabBadge: {
    backgroundColor: COLORS.gray + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: COLORS.blue + '30',
  },
  tabBadgeText: {
    fontFamily: 'Bold',
    fontSize: 10,
    color: COLORS.gray,
  },
  tabBadgeTextActive: {
    color: COLORS.blue,
  },

  /* List */
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  /* Cards */
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  clientName: {
    fontFamily: 'Medium',
    fontSize: SIZES.base,
    color: COLORS.blue,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
  },

  /* Info */
  cardInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },

  /* Message */
  messagePreview: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    lineHeight: 20,
    marginBottom: 12,
  },

  /* Failure */
  failureReason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.danger + '10',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  failureText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.danger,
    flex: 1,
  },

  /* Actions */
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
  },
  actionButtonText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  actionButtonOutlineText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
  actionButtonDanger: {
    borderColor: COLORS.danger,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 98,
    backgroundColor: COLORS.blue,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  /* Empty State */
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 40,
  },
});