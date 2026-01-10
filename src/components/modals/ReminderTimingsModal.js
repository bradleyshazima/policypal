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
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const { height } = Dimensions.get('window');

const TIMING_OPTIONS = [
  { id: '30', label: '30 days before expiry' },
  { id: '15', label: '15 days before expiry' },
  { id: '10', label: '10 days before expiry' },
  { id: '7', label: '7 days before expiry' },
  { id: '5', label: '5 days before expiry' },
  { id: '3', label: '3 days before expiry' },
  { id: '1', label: '1 day before expiry' },
];

export default function ReminderTimingsModal({ visible, onClose, onSave, initialValues = [] }) {
  const [selectedTimings, setSelectedTimings] = useState(initialValues);
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

  const toggleTiming = (id) => {
    if (selectedTimings.includes(id)) {
      setSelectedTimings(selectedTimings.filter((t) => t !== id));
    } else {
      setSelectedTimings([...selectedTimings, id]);
    }
  };

  const handleSave = () => {
    onSave(selectedTimings);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Default Reminder Timings</Text>
            <TouchableOpacity onPress={onClose}>
              <Octicons name="x" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Select when you want to send reminders before policy expiry
          </Text>

          <View style={styles.optionsContainer}>
            {TIMING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={() => toggleTiming(option.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedTimings.includes(option.id) && styles.checkboxSelected,
                  ]}
                >
                  {selectedTimings.includes(option.id) && (
                    <Octicons name="check" size={16} color={COLORS.white} />
                  )}
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: height * 0.7,
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
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  optionLabel: {
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  saveButton: {
    backgroundColor: COLORS.blue,
  },
  cancelText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  saveText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});