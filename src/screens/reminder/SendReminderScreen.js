import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
  TextInput,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

/* ---------------- MOCK DATA ---------------- */

const CLIENTS = [
  { id: '1', name: 'Bradley Shazima' },
  { id: '2', name: 'Kevin Otieno' },
  { id: '3', name: 'Sarah Wanjiru' },
];

const TEMPLATES = [
  '15-day Insurance Reminder',
  '7-day Insurance Reminder',
  'Policy Expiry Today',
];

/* ---------------- SCREEN ---------------- */

export default function SendReminderScreen() {
  const [selectedClients, setSelectedClients] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('SMS');
  const [scheduleLater, setScheduleLater] = useState(false);

  /* ---------------- LOGIC ---------------- */

  const toggleClient = (id) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(c => c !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const estimatedCost = () => {
    if (deliveryMethod !== 'SMS') return 'Free';
    return `$${(selectedClients.length * 0.05).toFixed(2)} for ${selectedClients.length} SMS`;
  };

  /* ---------------- UI ---------------- */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >

      {/* ---------- CLIENT SELECTION ---------- */}
      <Section title="Select Client">
        <View style={styles.switchRow}>
          <Text style={styles.label}>Select multiple clients</Text>
          <Switch
            value={multiSelect}
            onValueChange={setMultiSelect}
          />
        </View>

        {CLIENTS.map(client => (
          <Pressable
            key={client.id}
            onPress={() => toggleClient(client.id)}
            style={[
              styles.selectItem,
              selectedClients.includes(client.id) && styles.selectedItem,
            ]}
          >
            <Text style={styles.selectText}>{client.name}</Text>
            {selectedClients.includes(client.id) && (
              <Octicons name="check" size={16} color={COLORS.blue} />
            )}
          </Pressable>
        ))}
      </Section>

      {/* ---------- TEMPLATE ---------- */}
      <Section title="Message Template">
        {TEMPLATES.map(template => (
          <Pressable
            key={template}
            onPress={() => {
              setSelectedTemplate(template);
              setMessage(`Reminder: ${template}`);
            }}
            style={[
              styles.selectItem,
              selectedTemplate === template && styles.selectedItem,
            ]}
          >
            <Text style={styles.selectText}>{template}</Text>
          </Pressable>
        ))}
      </Section>

      {/* ---------- MESSAGE ---------- */}
      <Section title="Message Preview / Edit">
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder="Type custom message..."
          style={styles.messageBox}
        />
      </Section>

      {/* ---------- DELIVERY METHOD ---------- */}
      <Section title="Delivery Method">
        {['SMS', 'WhatsApp', 'Email'].map(method => (
          <Pressable
            key={method}
            onPress={() => setDeliveryMethod(method)}
            style={styles.radioRow}
          >
            <View
              style={[
                styles.radio,
                deliveryMethod === method && styles.radioActive,
              ]}
            />
            <Text style={styles.label}>{method}</Text>
          </Pressable>
        ))}
      </Section>

      {/* ---------- SCHEDULE ---------- */}
      <Section title="Schedule">
        <View style={styles.switchRow}>
          <Text style={styles.label}>Schedule for later</Text>
          <Switch
            value={scheduleLater}
            onValueChange={setScheduleLater}
          />
        </View>

        {scheduleLater && (
          <View style={styles.scheduleBox}>
            <Text style={styles.meta}>
              Date & time picker goes here
            </Text>
          </View>
        )}
      </Section>

      {/* ---------- COST ---------- */}
      <View style={styles.costBox}>
        <Text style={styles.costText}>
          Estimated cost: {estimatedCost()}
        </Text>
      </View>

      {/* ---------- ACTION BUTTON ---------- */}
      <Pressable style={styles.sendButton}>
        <Text style={styles.sendText}>
          {scheduleLater ? 'Schedule Reminder' : 'Send Now'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    marginBottom: 10,
    color: COLORS.blue,
  },

  label: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.black,
  },

  meta: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  selectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  selectedItem: {
    backgroundColor: COLORS.lightGray,
  },

  selectText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
  },

  messageBox: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    textAlignVertical: 'top',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: 10,
  },

  radioActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },

  scheduleBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },

  costBox: {
    marginVertical: 10,
    alignItems: 'center',
  },

  costText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
  },

  sendButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },

  sendText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});
