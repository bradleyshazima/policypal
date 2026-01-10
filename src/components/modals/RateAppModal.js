import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

const { height } = Dimensions.get('window');

export default function RateAppModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
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
      // Reset on close
      setTimeout(() => {
        setRating(0);
        setFeedback('');
      }, 300);
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit({ rating, feedback });
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Rate PolicyPal</Text>
            <TouchableOpacity onPress={onClose}>
              <Octicons name="x" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            How would you rate your experience with our app?
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Octicons
                  name={star <= rating ? 'star-fill' : 'star'}
                  size={40}
                  color={star <= rating ? COLORS.warning : COLORS.gray}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Text (only shows after rating) */}
          {rating > 0 && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackLabel}>
                Share your feedback (optional)
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Tell us what you think..."
                placeholderTextColor={COLORS.gray}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Action Buttons */}
          {rating > 0 && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
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
    marginBottom: 24,
    lineHeight: 18,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    },
    star: {
    marginHorizontal: 4,
    },
    feedbackContainer: {
    marginBottom: 20,
    },
    feedbackLabel: {
    fontFamily: 'Medium',
    fontSize: SIZES.small,
    color: COLORS.black,
    marginBottom: 8,
    },
    feedbackInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Regular',
    fontSize: SIZES.small,
    color: COLORS.black,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.gray,
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
    submitButton: {
    backgroundColor: COLORS.blue,
    },
    cancelText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.gray,
    },
    submitText: {
    fontFamily: 'SemiBold',
    fontSize: SIZES.small,
    color: COLORS.white,
    },
});