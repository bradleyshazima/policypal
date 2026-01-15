import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Alert from '../../components/common/Alert';
import api from '../../services/api';

export default function SendReminderScreen({ route }) {
  const preselectedClientId = route?.params?.preselectedClientId;
  
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [selectedClients, setSelectedClients] = useState(preselectedClientId ? [preselectedClientId] : []);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('sms');
  const [scheduleLater, setScheduleLater] = useState(false);
  const [showClients, setShowClients] = useState(false);
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsData, templatesData] = await Promise.all([
        api.clients.getAll({ status: 'active' }),
        api.templates.getAll(),
      ]);

      setClients(clientsData.clients || []);
      setTemplates(templatesData.templates || []);
    } catch (error) {
      console.error('Fetch data error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to load data. Please try again.',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

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
    if (deliveryMethod !== 'sms') return 'Free';
    const count = selectedClients.length || 0;
    return `$${(count * 0.05).toFixed(2)}`;
  };

  const getSelectedClientNames = () => {
    if (selectedClients.length === 0) return 'Select client(s)';
    if (selectedClients.length === 1) {
      return clients.find(c => c.id === selectedClients[0])?.full_name || 'Unknown';
    }
    return `${selectedClients.length} clients selected`;
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setMessage(template.message);
  };

  const handleSubmit = async () => {
    if (selectedClients.length === 0) {
      setAlertConfig({
        type: 'warning',
        title: 'No Clients Selected',
        message: 'Please select at least one client.',
      });
      setShowAlert(true);
      return;
    }

    if (!message.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'No Message',
        message: 'Please enter a message.',
      });
      setShowAlert(true);
      return;
    }

    setSending(true);

    try {
      const reminderData = {
        clientIds: selectedClients,
        message: message,
        deliveryMethod: deliveryMethod,
      };

      if (scheduleLater) {
        reminderData.scheduleDate = new Date().toISOString(); // You can add date picker here
      }

      const result = await api.reminders.sendManual(reminderData);

      setAlertConfig({
        type: 'success',
        title: 'Success',
        message: `${result.successful || 0} reminder(s) sent successfully!`,
      });
      setShowAlert(true);

      // Reset form
      setTimeout(() => {
        setSelectedClients([]);
        setMessage('');
        setSelectedTemplate(null);
        setScheduleLater(false);
      }, 2000);
    } catch (error) {
      console.error('Send reminder error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: error.message || 'Failed to send reminders. Please try again.',
      });
      setShowAlert(true);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
              {clients.length === 0 ? (
                <Text style={styles.emptyText}>No active clients available</Text>
              ) : (
                clients.map((client, index) => (
                  <TouchableOpacity
                    key={client.id}
                    onPress={() => toggleClient(client.id)}
                    style={[
                      styles.clientItem,
                      selectedClients.includes(client.id) && styles.selectedClientItem,
                      index === clients.length - 1 && { borderBottomWidth: 0 },
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
                        <Text style={styles.clientName}>{client.full_name}</Text>
                        <Text style={styles.clientPlate}>
                          {client.plate_number || `${client.car_make} ${client.car_model}`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
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
          
          {templates.length === 0 ? (
            <Text style={styles.emptyText}>No templates available</Text>
          ) : (
            templates.map((template, index) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => handleTemplateSelect(template)}
                style={[
                  styles.templateItem,
                  selectedTemplate === template.id && styles.selectedTemplateItem,
                  index === templates.length - 1 && { borderBottomWidth: 0 },
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
            ))
          )}
        </View>

        {/* ---------- MESSAGE ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message Preview</Text>
          <Text style={styles.messageHelper}>
            Use {'{client_name}'}, {'{car_model}'}, {'{expiry_date}'} as placeholders
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
              { value: 'sms', icon: 'chatbubble-ellipses', label: 'SMS' },
              { value: 'whatsapp', icon: 'logo-whatsapp', label: 'WhatsApp' },
              { value: 'email', icon: 'mail', label: 'Email' },
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
              <Ionicons name="calendar" size={20} color={COLORS.blue} />
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
                {deliveryMethod === 'sms' && selectedClients.length > 0 && (
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
            (selectedClients.length === 0 || !message || sending) && styles.sendButtonDisabled,
          ]}
          disabled={selectedClients.length === 0 || !message || sending}
          onPress={handleSubmit}
        >
          {sending ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons
                name={scheduleLater ? "time" : "send"}
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.sendText}>
                {scheduleLater ? 'Schedule Reminder' : 'Send Now'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  emptyText: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    paddingVertical: 20,
  },
});