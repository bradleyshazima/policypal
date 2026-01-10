import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const { height } = Dimensions.get('window');

const TIMEZONES = [
  { id: 'EAT', name: 'East Africa Time', offset: 'UTC+3' },
  { id: 'CAT', name: 'Central Africa Time', offset: 'UTC+2' },
  { id: 'WAT', name: 'West Africa Time', offset: 'UTC+1' },
  { id: 'GMT', name: 'Greenwich Mean Time', offset: 'UTC+0' },
  { id: 'EST', name: 'Eastern Standard Time', offset: 'UTC-5' },
  { id: 'CST', name: 'Central Standard Time', offset: 'UTC-6' },
  { id: 'MST', name: 'Mountain Standard Time', offset: 'UTC-7' },
  { id: 'PST', name: 'Pacific Standard Time', offset: 'UTC-8' },
];

export default function TimeZoneModal({ visible, onClose, onSelect, selectedTimeZone = 'EAT' }) {
  const [selected, setSelected] = useState(selectedTimeZone);
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
            <Text style={styles.title}>Select Time Zone</Text>
            <TouchableOpacity onPress={onClose}>
              <Octicons name="x" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {TIMEZONES.map((timezone) => (
              <TouchableOpacity
                key={timezone.id}
                style={[
                  styles.option,
                  selected === timezone.id && styles.selectedOption,
                ]}
                onPress={() => handleSelect(timezone.id)}
                activeOpacity={0.7}
              >
                <View style={styles.timezoneInfo}>
                  <Text style={styles.timezoneName}>{timezone.name}</Text>
                  <Text style={styles.timezoneOffset}>{timezone.offset}</Text>
                </View>
                {selected === timezone.id && (
                  <Octicons name="check" size={20} color={COLORS.blue} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    maxHeight: height * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Bold',
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.accent,
  },
  timezoneInfo: {
    flex: 1,
  },
  timezoneName: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  timezoneOffset: {
    fontFamily: 'Regular',
    fontSize: SIZES.xsmall,
    color: COLORS.gray,
    marginTop: 2,
  },
});