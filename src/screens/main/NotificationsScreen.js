import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'success',
    title: 'Reminder Delivered',
    message: 'Your reminder to Bradley Shazima was successfully delivered via SMS',
    timestamp: '2 min ago',
    read: false,
    category: 'reminders',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Payment Reminder Failed',
    message: 'Failed to send reminder to Kevin Otieno. Invalid phone number.',
    timestamp: '15 min ago',
    read: false,
    category: 'reminders',
  },
  {
    id: '3',
    type: 'info',
    title: 'New Client Added',
    message: 'Sarah Wanjiru has been added to your client list',
    timestamp: '1 hour ago',
    read: true,
    category: 'system',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Policy Expiring Soon',
    message: 'Henry Shikoli\'s policy expires in 7 days. Send a reminder?',
    timestamp: '2 hours ago',
    read: false,
    category: 'reminders',
  },
  {
    id: '5',
    type: 'success',
    title: 'Payment Received',
    message: 'Policy renewed for Faith Busolo - KCY 184Y',
    timestamp: '3 hours ago',
    read: true,
    category: 'system',
  },
  {
    id: '6',
    type: 'info',
    title: 'System Update',
    message: 'PolicyPal has been updated to version 1.2.0. Check out new features!',
    timestamp: '5 hours ago',
    read: true,
    category: 'system',
  },
  {
    id: '7',
    type: 'success',
    title: 'Bulk Reminders Sent',
    message: '15 reminders sent successfully to clients with policies expiring this month',
    timestamp: '1 day ago',
    read: true,
    category: 'reminders',
  },
  {
    id: '8',
    type: 'warning',
    title: 'Trial Ending Soon',
    message: 'Your trial ends in 3 days. Upgrade to continue using all features.',
    timestamp: '1 day ago',
    read: false,
    category: 'system',
  },
];

const FILTERS = ['All', 'Unread', 'Reminders', 'System'];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !notif.read;
    if (activeFilter === 'Reminders') return notif.category === 'reminders';
    if (activeFilter === 'System') return notif.category === 'system';
    return true;
  });

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const handleDeleteNotification = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setNotifications((prev) => prev.filter((n) => n.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSubtitle}>
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <View style={styles.headerActions}>
            {notifications.length > 0 && unreadCount > 0 && (
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={handleMarkAllRead}
              >
                <Octicons name="check" size={16} color={COLORS.blue} />
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {FILTERS.map((filter) => {
            const count =
              filter === 'All'
                ? notifications.length
                : filter === 'Unread'
                ? unreadCount
                : notifications.filter((n) => n.category === filter.toLowerCase()).length;

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  activeFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      styles.filterBadge,
                      activeFilter === filter && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        activeFilter === filter && styles.filterBadgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ==================== NOTIFICATIONS LIST ==================== */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Octicons name="inbox" size={64} color={COLORS.gray} />
          </View>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyMessage}>
            {activeFilter === 'All'
              ? "You're all caught up! No notifications to show."
              : `No ${activeFilter.toLowerCase()} notifications`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onToggleRead={handleToggleRead}
              onDelete={handleDeleteNotification}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ==================== CLEAR ALL BUTTON ==================== */}
      {notifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearAllButton}
          onPress={handleClearAll}
        >
          <Octicons name="trash" size={16} color={COLORS.danger} />
          <Text style={styles.clearAllText}>Clear All Notifications</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ==================== NOTIFICATION ITEM COMPONENT ==================== */

const NotificationItem = ({ notification, onToggleRead, onDelete }) => {
  const { id, type, title, message, timestamp, read } = notification;

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          name: 'check-circle',
          color: COLORS.success,
          bgColor: 'rgba(34, 197, 94, 0.1)',
        };
      case 'warning':
        return {
          name: 'alert',
          color: COLORS.warning,
          bgColor: 'rgba(234, 179, 8, 0.1)',
        };
      case 'info':
        return {
          name: 'info',
          color: COLORS.blue,
          bgColor: COLORS.accent,
        };
      default:
        return {
          name: 'bell',
          color: COLORS.gray,
          bgColor: COLORS.primary,
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <TouchableOpacity
      style={[styles.notificationItem, !read && styles.notificationUnread]}
      onPress={() => onToggleRead(id)}
      activeOpacity={0.7}
    >
      {/* Unread Indicator */}
      {!read && <View style={styles.unreadIndicator} />}

      {/* Icon */}
      <View
        style={[
          styles.notificationIcon,
          { backgroundColor: iconConfig.bgColor },
        ]}
      >
        <Octicons name={iconConfig.name} size={20} color={iconConfig.color} />
      </View>

      {/* Content */}
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, !read && styles.textUnread]}>
            {title}
          </Text>
          <Text style={styles.notificationTimestamp}>{timestamp}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {message}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.notificationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onToggleRead(id)}
        >
          <Octicons
            name={read ? 'mail' : 'mail-read'}
            size={18}
            color={COLORS.blue}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(id)}
        >
          <Octicons name="trash" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  /* Header */
  header: {
    backgroundColor: COLORS.lightGray,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  headerSubtitle: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markAllText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },

  /* Filters */
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  filterTabActive: {
    backgroundColor: COLORS.blue,
  },
  filterText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  filterBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontFamily: 'Bold',
    fontSize: 10,
    color: COLORS.blue,
  },
  filterBadgeTextActive: {
    color: COLORS.white,
  },

  /* List */
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  /* Notification Item */
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  notificationUnread: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    left: 0,
    width: 4,
    height: 40,
    backgroundColor: COLORS.blue,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  textUnread: {
    fontFamily: 'SemiBold',
  },
  notificationTimestamp: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  notificationMessage: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    lineHeight: 18,
  },
  notificationActions: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Empty State */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Clear All Button */
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  clearAllText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.danger,
  },
});