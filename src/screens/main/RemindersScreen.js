import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

/* ---------------- MOCK DATA ---------------- */

const MOCK_REMINDERS = {
  Scheduled: [
    {
      id: '1',
      client: 'Bradley Shazima',
      daysLeft: 10,
      type: '15-day reminder',
      message: 'Your insurance expires soon. Please renew in time.',
    },
  ],
  Sent: [
    {
      id: '2',
      client: 'Kevin Otieno',
      date: 'Jan 5 • 10:30 AM',
      status: 'Delivered',
      message: 'Your insurance renewal was successful.',
    },
  ],
  Failed: [
    {
      id: '3',
      client: 'Sarah Wanjiru',
      reason: 'Invalid phone number',
      message: 'Your policy is about to expire.',
    },
  ],
};

/* ---------------- MAIN SCREEN ---------------- */

export default function RemindersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Scheduled');

  return (
    <View style={styles.container}>

      {/* ---------- TOP TABS ---------- */}
      <View style={styles.tabs}>
        {['Scheduled', 'Sent', 'Failed'].map(tab => (
          <Pressable
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
          </Pressable>
        ))}
      </View>

      {/* ---------- FILTER BAR ---------- */}
      <View style={styles.filterBar}>
        <FilterChip label="Date" />
        <FilterChip label="Client" />
        <FilterChip label="Type" />
      </View>

      {/* ---------- LIST ---------- */}
      <FlatList
        contentContainerStyle={{ paddingBottom: 120 }}
        data={MOCK_REMINDERS[activeTab]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          if (activeTab === 'Scheduled') return <ScheduledCard item={item} />;
          if (activeTab === 'Sent') return <SentCard item={item} />;
          return <FailedCard item={item} />;
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reminders here</Text>
        }
      />

      {/* ---------- FAB ---------- */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('SendReminder')}
      >
        <Octicons name="plus" size={24} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const FilterChip = ({ label }) => (
  <Pressable style={styles.filterChip}>
    <Text style={styles.filterText}>{label}</Text>
    <Octicons name="chevron-down" size={14} color={COLORS.gray} />
  </Pressable>
);

/* ---------- Scheduled Card ---------- */
const ScheduledCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.rowBetween}>
      <Text style={styles.clientName}>{item.client}</Text>
      <Text style={styles.daysBadge}>{item.daysLeft} days</Text>
    </View>

    <Text style={styles.meta}>{item.type}</Text>
    <Text style={styles.preview}>{item.message}</Text>

    <View style={styles.actionsRow}>
      <ActionButton label="Edit" />
      <ActionButton label="Cancel" variant="danger" />
    </View>
  </View>
);

/* ---------- Sent Card ---------- */
const SentCard = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.clientName}>{item.client}</Text>
    <Text style={styles.meta}>{item.date}</Text>

    <Text style={[styles.status, styles.delivered]}>
      {item.status}
    </Text>

    <Text style={styles.preview}>{item.message}</Text>

    <ActionButton label="Resend" />
  </View>
);

/* ---------- Failed Card ---------- */
const FailedCard = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.clientName}>{item.client}</Text>

    <Text style={[styles.status, styles.failed]}>
      Failed • {item.reason}
    </Text>

    <Text style={styles.preview}>{item.message}</Text>

    <View style={styles.actionsRow}>
      <ActionButton label="Retry" />
      <ActionButton label="Edit Contact" variant="secondary" />
    </View>
  </View>
);

/* ---------- Action Button ---------- */
const ActionButton = ({ label, variant = 'primary' }) => (
  <Pressable
    style={[
      styles.actionButton,
      variant === 'danger' && styles.dangerButton,
      variant === 'secondary' && styles.secondaryButton,
    ]}
  >
    <Text
      style={[
        styles.actionText,
        variant === 'secondary' && { color: COLORS.blue },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
  },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
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

  /* Filters */
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },

  /* Cards */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientName: {
    fontFamily: 'Medium',
    fontSize: SIZES.base,
    color: COLORS.blue,
  },
  meta: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 4,
  },
  preview: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    marginTop: 8,
    color: COLORS.black,
  },

  /* Status */
  status: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    marginTop: 6,
  },
  delivered: {
    color: COLORS.success,
  },
  failed: {
    color: COLORS.error,
  },

  daysBadge: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },

  /* Actions */
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  secondaryButton: {
    backgroundColor: COLORS.lightGray,
  },
  actionText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: COLORS.blue,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.gray,
    fontFamily: 'Regular',
  },
});
