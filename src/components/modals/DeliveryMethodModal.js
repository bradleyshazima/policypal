import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const { height } = Dimensions.get('window');

const DELIVERY_METHODS = [
  { id: 'SMS', name: 'SMS', icon: 'chatbubble-ellipses', description: 'Send via text message' },
  { id: 'WhatsApp', name: 'WhatsApp', icon: 'logo-whatsapp', description: 'Send via WhatsApp' },
  { id: 'Email', name: 'Email', icon: 'mail', description: 'Send via email' },
  { id: 'Push', name: 'Push Notification', icon: 'notifications', description: 'In-app notification' },
];

export default function DeliveryMethodModal({ visible, onClose, onSelect, selectedMethod = 'SMS' }) {
  const [selected, setSelected] = useState(selectedMethod);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSelect = (id) => {
    setSelected(id);
    onSelect(id);
    setTimeout(() => onClose(), 200);
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Default Delivery Method</Text>
            <TouchableOpacity onPress={onClose}>
              <Octicons name="x" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Choose how reminders will be sent to clients by default
          </Text>

          {DELIVERY_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.option,
                selected === method.id && styles.selectedOption,
              ]}
              onPress={() => handleSelect(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.methodInfo}>
                <View style={[
                  styles.iconContainer,
                  selected === method.id && styles.selectedIconContainer,
                ]}>
                  <Ionicons 
                    name={method.icon} 
                    size={24} 
                    color={selected === method.id ? COLORS.blue : COLORS.gray} 
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </View>
              {selected === method.id && (
                <Octicons name="check-circle-fill" size={24} color={COLORS.blue} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  description: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 18,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.lightGray,
  },
  selectedOption: {
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.blue,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.white,
  },
  textContainer: {
    flex: 1,
  },
  methodName: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  methodDescription: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
});