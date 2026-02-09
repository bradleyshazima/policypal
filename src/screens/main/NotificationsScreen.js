import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert as RNAlert,
  ActivityIndicator,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import api from '../../services/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const FILTERS = ['All', 'Unread', 'Reminders', 'System'];

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.notifications.getAll();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark all as read when user leaves the screen
  useFocusEffect(
    useCallback(() => {
      // Refresh notifications when screen comes into focus
      fetchNotifications();

      // Return cleanup function that runs when leaving screen
      return async () => {
        try {
          // Mark all current notifications as read
          await api.notifications.markAllRead();
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      };
    }, [])
  );

  const handleDelete = async (id) => {
    try {
      await api.notifications.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const handleClearAll = () => {
    RNAlert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.notifications.deleteAll();
              setNotifications([]);
            } catch (error) {
              console.error('Clear all error:', error);
            }
          },
        },
      ]
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !notif.read;
    if (activeFilter === 'Reminders') return notif.category === 'reminders';
    if (activeFilter === 'System') return notif.category === 'system';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

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
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <SwipeableNotificationItem
              notification={item}
              onDelete={handleDelete}
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

/* ==================== SWIPEABLE NOTIFICATION ITEM ==================== */

const SwipeableNotificationItem = ({ notification, onDelete }) => {
  const { id, type, title, message, timestamp, read } = notification;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const panStartX = useRef(0);

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

  const handleSwipeStart = (event) => {
    panStartX.current = event.nativeEvent.pageX;
  };

  const handleSwipeMove = (event) => {
    const deltaX = event.nativeEvent.pageX - panStartX.current;
    translateX.setValue(deltaX);
  };

  const handleSwipeEnd = (event) => {
    const deltaX = event.nativeEvent.pageX - panStartX.current;
    
    // If swiped more than 100px in either direction, delete
    if (Math.abs(deltaX) > 100) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: deltaX > 0 ? 500 : -500,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDelete(id);
      });
    } else {
      // Snap back to original position
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
      }).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.notificationItem,
        !read && styles.notificationUnread,
        {
          opacity,
          transform: [{ translateX }],
        },
      ]}
      onTouchStart={handleSwipeStart}
      onTouchMove={handleSwipeMove}
      onTouchEnd={handleSwipeEnd}
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

      {/* Swipe Indicator */}
      <View style={styles.swipeHint}>
        <Text style={styles.swipeHintText}>Swipe to delete</Text>
      </View>
    </Animated.View>
  );
};

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
  swipeHint: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
    opacity: 0.3,
  },
  swipeHintText: {
    fontFamily: 'Regular',
    fontSize: 10,
    color: COLORS.gray,
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