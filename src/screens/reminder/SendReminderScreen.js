import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

/* ---------------- MOCK DATA ---------------- */

const CLIENTS = [
  { id: '1', name: 'Bradley Shazima', plate: 'KDC 204D' },
  { id: '2', name: 'Kevin Otieno', plate: 'KBZ 183C' },
  { id: '3', name: 'Sarah Wanjiru', plate: 'KCA 421A' },
  { id: '4', name: 'John Kinyua', plate: 'KDD 892B' },
  { id: '5', name: 'Mary Njeri', plate: 'KCB 156E' },
];

const TEMPLATES = [
  {
    id: '1',
    name: '15-day Insurance Reminder',
    message: 'Hi {name}, your insurance for {car} expires in 15 days on {date}. Please renew to avoid coverage gaps.',
  },
  {
    id: '2',
    name: '7-day Insurance Reminder',
    message: 'Hi {name}, your insurance for {car} expires in 7 days on {date}. Renew now to stay protected.',
  },
  {
    id: '3',
    name: 'Policy Expiry Today',
    message: 'URGENT: Hi {name}, your insurance for {car} expires TODAY. Please renew immediately.',
  },
];

/* ---------------- SCREEN ---------------- */

export default function SendReminderScreen() {
  const [selectedClients, setSelectedClients] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('SMS');
  const [scheduleLater, setScheduleLater] = useState(false);
  const [showClients, setShowClients] = useState(false);

  /* ---------------- LOGIC ---------------- */

  const toggleClient = (id) => {
    if (multiSelect) {
      if (selectedClients.includes(id)) {
        setSelectedClients(selectedClients.filter(c => c !== id));
      } else {
        setSelectedClients([...selectedClients, id]);
      }
    } else {
      setSelectedClients([id]);
      setShowClients(false);
    }
  };

  const estimatedCost = () => {
    if (deliveryMethod !== 'SMS') return 'Free';
    const count = selectedClients.length || 0;
    return `$${(count * 0.05).toFixed(2)}`;
  };

  const getSelectedClientNames = () => {
    if (selectedClients.length === 0) return 'Select client(s)';
    if (selectedClients.length === 1) {
      return CLIENTS.find(c => c.id === selectedClients[0])?.name;
    }
    return `${selectedClients.length} clients selected`;
  };

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- CLIENT SELECTION ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipients</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchLeft}>
              <Ionicons name="people" size={18} color={COLORS.blue} />
              <Text style={styles.switchLabel}>Select multiple clients</Text>
            </View>
            <Switch
              value={multiSelect}
              onValueChange={setMultiSelect}
              trackColor={{ false: COLORS.primary, true: COLORS.accent + '40' }}
              thumbColor={multiSelect ? COLORS.blue : COLORS.gray}
            />
          </View>

          <TouchableOpacity
            style={styles.clientSelector}
            onPress={() => setShowClients(!showClients)}
          >
            <Text style={[styles.clientSelectorText, selectedClients.length === 0 && { color: COLORS.gray }]}>
              {getSelectedClientNames()}
            </Text>
            <Ionicons
              name={showClients ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>

          {showClients && (
            <View style={styles.clientList}>
              {CLIENTS.map((client, index) => (
                <TouchableOpacity
                  key={client.id}
                  onPress={() => toggleClient(client.id)}
                  style={[
                    styles.clientItem,
                    selectedClients.includes(client.id) && styles.selectedClientItem,
                    index === CLIENTS.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.clientInfo}>
                    <View style={[
                      styles.checkbox,
                      selectedClients.includes(client.id) && styles.checkboxSelected,
                    ]}>
                      {selectedClients.includes(client.id) && (
                        <Ionicons name="checkmark" size={14} color={COLORS.white} />
                      )}
                    </View>
                    <View>
                      <Text style={styles.clientName}>{client.name}</Text>
                      <Text style={styles.clientPlate}>{client.plate}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedClients.length > 0 && (
            <View style={styles.selectedCount}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.blue} />
              <Text style={styles.selectedCountText}>
                {selectedClients.length} {selectedClients.length === 1 ? 'client' : 'clients'} selected
              </Text>
            </View>
          )}
        </View>

        {/* ---------- TEMPLATE ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message Template</Text>
          
          {TEMPLATES.map((template, index) => (
            <TouchableOpacity
              key={template.id}
              onPress={() => {
                setSelectedTemplate(template.id);
                setMessage(template.message);
              }}
              style={[
                styles.templateItem,
                selectedTemplate === template.id && styles.selectedTemplateItem,
                index === TEMPLATES.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.templateContent}>
                <View style={[
                  styles.templateRadio,
                  selectedTemplate === template.id && styles.templateRadioActive,
                ]}>
                  {selectedTemplate === template.id && (
                    <View style={styles.templateRadioDot} />
                  )}
                </View>
                <Text style={[
                  styles.templateText,
                  selectedTemplate === template.id && styles.selectedTemplateText,
                ]}>
                  {template.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---------- MESSAGE ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message Preview</Text>
          <Text style={styles.messageHelper}>
            Use {'{name}'}, {'{car}'}, {'{date}'} as placeholders
          </Text>
          
          <TextInput
            multiline
            value={message}
            onChangeText={setMessage}
            placeholder="Type your custom message here..."
            placeholderTextColor={COLORS.gray}
            style={styles.messageBox}
          />
          <Text style={styles.characterCount}>{message.length} characters</Text>
        </View>

        {/* ---------- DELIVERY METHOD ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          
          <View style={styles.deliveryOptions}>
            {[
              { value: 'SMS', icon: 'chatbubble-ellipses', label: 'SMS' },
              { value: 'WhatsApp', icon: 'logo-whatsapp', label: 'WhatsApp' },
              { value: 'Email', icon: 'mail', label: 'Email' },
            ].map((method) => (
              <TouchableOpacity
                key={method.value}
                onPress={() => setDeliveryMethod(method.value)}
                style={[
                  styles.deliveryOption,
                  deliveryMethod === method.value && styles.deliveryOptionActive,
                ]}
              >
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={deliveryMethod === method.value ? COLORS.blue : COLORS.gray}
                />
                <Text style={[
                  styles.deliveryLabel,
                  deliveryMethod === method.value && styles.deliveryLabelActive,
                ]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ---------- SCHEDULE ---------- */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <View style={styles.switchLeft}>
              <Ionicons name="time" size={18} color={COLORS.blue} />
              <Text style={styles.switchLabel}>Schedule for later</Text>
            </View>
            <Switch
              value={scheduleLater}
              onValueChange={setScheduleLater}
              trackColor={{ false: COLORS.primary, true: COLORS.primary + '40' }}
              thumbColor={scheduleLater ? COLORS.blue : COLORS.gray}
            />
          </View>

          {scheduleLater && (
            <View style={styles.scheduleBox}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.scheduleText}>
                Date & time picker will go here
              </Text>
            </View>
          )}
        </View>

        {/* ---------- COST ---------- */}
        <View style={styles.costContainer}>
          <View style={styles.costBox}>
            <Ionicons name="cash-outline" size={20} color={COLORS.warning} />
            <View style={styles.costContent}>
              <Text style={styles.costLabel}>Estimated Cost</Text>
              <Text style={styles.costValue}>
                {estimatedCost()}
                {deliveryMethod === 'SMS' && selectedClients.length > 0 && (
                  <Text style={styles.costDetail}> for {selectedClients.length} SMS</Text>
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ---------- FIXED ACTION BUTTON ---------- */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (selectedClients.length === 0 || !message) && styles.sendButtonDisabled,
          ]}
          disabled={selectedClients.length === 0 || !message}
        >
          <Ionicons
            name={scheduleLater ? "time" : "send"}
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.sendText}>
            {scheduleLater ? 'Schedule Reminder' : 'Send Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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

  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 12,
  },

  // Client Selection
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },

  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  switchLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.text,
  },

  clientSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },

  clientSelectorText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.text,
  },

  clientList: {
    borderRadius: 8,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },

  clientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  selectedClientItem: {
    backgroundColor: COLORS.accent,
  },

  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },

  clientName: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.text,
  },

  clientPlate: {
    fontFamily: 'Regular',
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
    marginTop: 2,
  },

  selectedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },

  selectedCountText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },

  // Templates
  templateItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  selectedTemplateItem: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },

  templateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  templateRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  templateRadioActive: {
    borderColor: COLORS.blue,
  },

  templateRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.blue,
  },

  templateText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.text,
    flex: 1,
  },

  selectedTemplateText: {
    fontFamily: 'SemiBold',
    color: COLORS.blue,
  },

  // Message
  messageHelper: {
    fontFamily: 'Regular',
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
    marginBottom: 8,
    fontStyle: 'italic',
  },

  messageBox: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    textAlignVertical: 'top',
    backgroundColor: COLORS.background,
  },

  characterCount: {
    fontFamily: 'Regular',
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 6,
  },

  // Delivery Method
  deliveryOptions: {
    flexDirection: 'row',
    gap: 12,
  },

  deliveryOption: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    gap: 8,
  },

  deliveryOptionActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent + '08',
  },

  deliveryLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },

  deliveryLabelActive: {
    color: COLORS.blue,
  },

  // Schedule
  scheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    marginTop: 12,
  },

  scheduleText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontStyle: 'italic',
  },

  // Cost
  costContainer: {
    marginBottom: 16,
  },

  costBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.warning + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.warning + '20',
  },

  costContent: {
    flex: 1,
  },

  costLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
  },

  costValue: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.warning,
    marginTop: 2,
  },

  costDetail: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  sendButton: {
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },

  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },

  sendText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});