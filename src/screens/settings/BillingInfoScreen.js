import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function BillingInfoScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Form state
  const [cardholderName, setCardholderName] = useState('Bradley Shazima');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvv, setCvv] = useState('•••');
  const [billingAddress, setBillingAddress] = useState('123 Main Street');
  const [city, setCity] = useState('Nairobi');
  const [country, setCountry] = useState('Kenya');
  const [postalCode, setPostalCode] = useState('00100');

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      setShowAlert(true);
    }, 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Info Card */}
      <View style={styles.infoCard}>
        <Octicons name="shield-check" size={24} color={COLORS.success} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Secure Payment</Text>
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Input
            label="Cardholder Name"
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="Name on card"
            editable={isEditing}
            inputStyle={!isEditing && styles.disabledInput}
          />

          <Input
            label="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="1234 5678 9012 3456"
            editable={isEditing}
            inputStyle={!isEditing && styles.disabledInput}
            keyboardType="numeric"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Expiry Date"
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/YY"
                editable={isEditing}
                inputStyle={!isEditing && styles.disabledInput}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                editable={isEditing}
                inputStyle={!isEditing && styles.disabledInput}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Billing Address Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Address</Text>
        
        <View style={styles.card}>
          <Input
            label="Street Address"
            value={billingAddress}
            onChangeText={setBillingAddress}
            placeholder="Enter street address"
            editable={isEditing}
            inputStyle={!isEditing && styles.disabledInput}
          />

          <Input
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Enter city"
            editable={isEditing}
            inputStyle={!isEditing && styles.disabledInput}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Country"
                value={country}
                onChangeText={setCountry}
                placeholder="Country"
                editable={isEditing}
                inputStyle={!isEditing && styles.disabledInput}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Postal Code"
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="00100"
                editable={isEditing}
                inputStyle={!isEditing && styles.disabledInput}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Saved Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        
        <View style={styles.card}>
          <PaymentMethodItem
            type="Visa"
            last4="4242"
            expiry="12/25"
            isDefault
          />
          <PaymentMethodItem
            type="M-Pesa"
            last4="5678"
            expiry="Active"
          />
        </View>

        <TouchableOpacity style={styles.addMethodButton}>
          <Octicons name="plus" size={16} color={COLORS.blue} />
          <Text style={styles.addMethodText}>Add New Payment Method</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      {isEditing && (
        <View style={styles.actions}>
          <Button title="Save Changes" onPress={handleSave} loading={loading} />
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => setIsEditing(false)}
          />
        </View>
      )}

      <View style={{ height: 40 }} />

      <Alert
        visible={showAlert}
        title="Billing Info Updated"
        message="Your billing information has been saved successfully"
        type="success"
        onConfirm={() => setShowAlert(false)}
      />
    </ScrollView>
  );
}

const PaymentMethodItem = ({ type, last4, expiry, isDefault }) => (
  <View style={styles.paymentMethodItem}>
    <View style={styles.paymentMethodLeft}>
      <View style={styles.cardIcon}>
        <Octicons name="credit-card" size={20} color={COLORS.blue} />
      </View>
      <View>
        <Text style={styles.paymentMethodType}>
          {type} •••• {last4}
        </Text>
        <Text style={styles.paymentMethodExpiry}>Expires {expiry}</Text>
      </View>
    </View>
    {isDefault && (
      <View style={styles.defaultBadge}>
        <Text style={styles.defaultText}>Default</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.success + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.success,
    marginBottom: 4,
  },
  infoText: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.success,
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  editLink: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  disabledInput: {
    backgroundColor: COLORS.lightGray,
    borderColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodType: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  paymentMethodExpiry: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontFamily: 'Medium',
    fontSize: SIZES.xsmall,
    color: COLORS.white,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.blue,
    borderStyle: 'dashed',
    marginTop: 12,
  },
  addMethodText: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.blue,
  },
  actions: {
    gap: 12,
  },
});