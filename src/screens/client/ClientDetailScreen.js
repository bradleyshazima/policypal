import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import { Octicons, FontAwesome } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const TABS = ['Overview', 'Reminders', 'Notes'];

export default function ClientDetailScreen({ navigation, route }) {
  const { clientId } = route.params;
  const [activeTab, setActiveTab] = useState('Overview');
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const data = await api.clients.getById(clientId);
      setClient(data.client);
    } catch (error) {
      console.error('Fetch client error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to load client details',
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchClientDetails();
    }, [clientId])
  );

  const handleDelete = () => {
    setAlertConfig({
      type: 'danger',
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
    });
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await api.clients.delete(clientId);
      navigation.goBack();
    } catch (error) {
      console.error('Delete client error:', error);
      setAlertConfig({
        type: 'danger',
        title: 'Error',
        message: 'Failed to delete client',
      });
      setShowAlert(true);
    }
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSMS = (phoneNumber) => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const getDaysToExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading client details...</Text>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.errorContainer}>
        <Octicons name="alert" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>Client not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const daysToExpiry = getDaysToExpiry(client.expiry_date);

  return (
    <View style={{ flex: 1 }}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.avatar}>
            <Octicons name="person" size={24} color={COLORS.blue} />
          </View>
          <View>
            <Text style={styles.clientName}>{client.full_name}</Text>
            <Text style={styles.subText}>{client.insurance_type || 'N/A'}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('EditClient', { clientId: client.id })}
          >
            <Octicons name="pencil" size={18} color={COLORS.blue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
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
      <ScrollView 
        contentContainerStyle={styles.main} 
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Overview' && (
          <>
            <InfoCard title="Contact Information">
              <InfoRow label="Phone" value={client.phone || 'N/A'} />
              {client.alt_phone && (
                <InfoRow label="Alt. Phone" value={client.alt_phone} />
              )}
              {client.email && <InfoRow label="Email" value={client.email} />}
              {client.address && (
                <InfoRow label="Address" value={client.address} />
              )}
              {client.id_number && (
                <InfoRow label="ID Number" value={client.id_number} />
              )}
            </InfoCard>

            <InfoCard title="Vehicle Information">
              <InfoRow 
                label="Make & Model" 
                value={`${client.car_make} ${client.car_model}`} 
              />
              {client.plate_number && (
                <InfoRow label="Plate" value={client.plate_number} />
              )}
              {client.car_color && (
                <InfoRow label="Color" value={client.car_color} />
              )}
              {client.car_year && (
                <InfoRow label="Year" value={client.car_year} />
              )}
              {client.vin_number && (
                <InfoRow label="VIN" value={client.vin_number} />
              )}
            </InfoCard>

            <InfoCard title="Insurance Details">
              <InfoRow 
                label="Policy No." 
                value={client.policy_number || 'N/A'} 
              />
              <InfoRow 
                label="Company" 
                value={client.insurance_company || 'N/A'} 
              />
              {client.coverage_amount && (
                <InfoRow 
                  label="Premium" 
                  value={`${client.currency || ''} ${client.coverage_amount}`} 
                />
              )}
              {client.start_date && (
                <InfoRow 
                  label="Start Date" 
                  value={new Date(client.start_date).toLocaleDateString()} 
                />
              )}
              <InfoRow 
                label="Expiry" 
                value={new Date(client.expiry_date).toLocaleDateString()} 
              />
              {daysToExpiry !== null && (
                <Text style={[
                  styles.countdown,
                  { color: daysToExpiry < 7 ? COLORS.danger : 
                          daysToExpiry < 30 ? COLORS.warning : COLORS.success }
                ]}>
                  ⏳ {daysToExpiry > 0 
                    ? `${daysToExpiry} days to renewal` 
                    : daysToExpiry === 0 
                    ? 'Expires today!' 
                    : 'Expired'}
                </Text>
              )}
            </InfoCard>

            <View style={styles.quickActions}>
              <QuickAction 
                icon="phone" 
                label="Call" 
                onPress={() => handleCall(client.phone)}
              />
              <QuickAction 
                icon="comment" 
                label="SMS" 
                onPress={() => handleSMS(client.phone)}
              />
              <QuickAction 
                icon="whatsapp" 
                label="WhatsApp" 
                onPress={() => handleWhatsApp(client.phone)}
              />
              {client.email && (
                <QuickAction 
                  icon="envelope" 
                  label="Email" 
                  onPress={() => handleEmail(client.email)}
                />
              )}
            </View>
          </>
        )}

        {activeTab === 'Reminders' && (
          <InfoCard title="Reminder Settings">
            <InfoRow 
              label="Reminders Enabled" 
              value={client.reminders_enabled ? 'Yes' : 'No'} 
            />
            {client.custom_message && (
              <>
                <Text style={styles.label}>Custom Message:</Text>
                <Text style={styles.value}>{client.custom_message}</Text>
              </>
            )}
            <Button 
              title="Send Manual Reminder" 
              onPress={() => navigation.navigate('RemindersTab', {
                screen: 'SendReminder',
                params: { preselectedClientId: client.id }
              })}
            />
          </InfoCard>
        )}

        {activeTab === 'Notes' && (
          <InfoCard title="Notes">
            <Text style={styles.label}>No notes available</Text>
          </InfoCard>
        )}
      </ScrollView>

      <Alert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowAlert(false)}
      />
    </View>
  );
}

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

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <FontAwesome name={icon} size={16} color={COLORS.blue} />
    <Text style={styles.quickText}>{label}</Text>
  </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  errorText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.large,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 24,
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
    alignItems: 'center',
    justifyContent: 'center',
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
});