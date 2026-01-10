import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import Button from '../../components/common/Button';

const TABS = ['Overview', 'Policy History', 'Reminders', 'Notes'];

export default function ClientDetailScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={{ flex: 1 }}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.clientName}>Bradley Shazima</Text>
            <Text style={styles.subText}>Comprehensive Cover</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('EditClient')}>
            <Octicons name="pencil" size={18} color={COLORS.blue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Delete client')}>
            <Octicons name="trash" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= TABS ================= */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
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
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Policy History' && <PolicyHistoryTab />}
        {activeTab === 'Reminders' && <RemindersTab />}
        {activeTab === 'Notes' && <NotesTab />}
      </ScrollView>


    </View>
  );
}

/* =====================================================
   TABS CONTENT
===================================================== */

const OverviewTab = () => (
  <>
    <InfoCard title="Contact Information">
      <InfoRow label="Phone" value="+254 712 345 678" />
      <InfoRow label="Email" value="bradley@email.com" />
      <InfoRow label="Address" value="Nairobi, Kenya" />
    </InfoCard>

    <InfoCard title="Vehicle Information">
      <InfoRow label="Type" value="Motorcycle" />
      <InfoRow label="Plate" value="KMTC 114A" />
      <InfoRow label="Color" value="Black" />
    </InfoCard>

    <InfoCard title="Insurance Details">
      <InfoRow label="Policy No." value="INS-23941" />
      <InfoRow label="Company" value="Jubilee Insurance" />
      <InfoRow label="Expiry" value="12 Feb 2026" />
      <Text style={styles.countdown}>⏳ 28 days to renewal</Text>
    </InfoCard>

    <View style={styles.quickActions}>
      <QuickAction icon="phone" label="Call" />
      <QuickAction icon="comment" label="SMS" />
      <QuickAction icon="whatsapp" label="WhatsApp" />
      <QuickAction icon="envelope" label="Email" />
    </View>
  </>
);

const PolicyHistoryTab = () => (
  <InfoCard title="Policy Timeline">
    <TimelineItem
      title="Policy Renewed"
      date="12 Feb 2025"
      description="Comprehensive cover renewed"
    />
    <TimelineItem
      title="Policy Created"
      date="12 Feb 2024"
      description="Initial policy purchase"
    />
  </InfoCard>
);

const RemindersTab = () => (
  <InfoCard title="Reminders">
    <ReminderItem status="Delivered" date="01 Feb 2026" />
    <ReminderItem status="Pending" date="05 Feb 2026" />
    <ReminderItem status="Failed" date="07 Feb 2026" />
  </InfoCard>
);

const NotesTab = () => (
  <>
    <InfoCard title="Notes">
      <NoteItem text="Client prefers WhatsApp reminders." />
      <NoteItem text="Follow up on renewal payment." />
    </InfoCard>

    <Button title="+ Add Note" onPress={() => console.log('Add note')} />
  </>
);

/* =====================================================
   SMALL REUSABLE COMPONENTS
===================================================== */

const InfoCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const QuickAction = ({ icon, label }) => (
  <TouchableOpacity style={styles.quickAction}>
    <FontAwesome name={icon} size={16} color={COLORS.blue} />
    <Text style={styles.quickText}>{label}</Text>
  </TouchableOpacity>
);

const TimelineItem = ({ title, date, description }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.value}>{title}</Text>
    <Text style={styles.subText}>{date}</Text>
    <Text style={styles.label}>{description}</Text>
  </View>
);

const ReminderItem = ({ status, date }) => (
  <View style={styles.row}>
    <Text style={styles.value}>{date}</Text>
    <Text
      style={{
        fontFamily: 'Medium',
        color:
          status === 'Delivered'
            ? COLORS.success
            : status === 'Failed'
            ? COLORS.danger
            : COLORS.warning,
      }}
    >
      {status}
    </Text>
  </View>
);

const NoteItem = ({ text }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.value}>{text}</Text>
    <Text style={styles.subText}>Added today</Text>
  </View>
);

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  main: {
    padding: 16,
    backgroundColor: COLORS.primary,
    paddingBottom: 120,
    minHeight: '100%'
  },
  header: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.accent,
    borderRadius: 24,
  },
  clientName: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.blue,
  },
  subText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: COLORS.blue,
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
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.medium,
    marginBottom: 12,
    color: COLORS.blue,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },
  value: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  countdown: {
    fontFamily: 'Medium',
    color: COLORS.warning,
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:20,
  },
  quickAction: {
    alignItems: 'center',
    gap: 4,
  },
  quickText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.blue,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.blue,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
