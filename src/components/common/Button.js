import React from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [
          styles.secondary,
          isDisabled && styles.disabledSecondary,
        ];
      case 'danger':
        return [
          styles.danger,
          isDisabled && styles.disabledDanger,
        ];
      case 'primary':
      default:
        return [
          styles.primary,
          isDisabled && styles.disabledPrimary,
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.secondaryText, textStyle];
      case 'primary':
      default:
        return [styles.primaryText, textStyle];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#fff' : '#171717'}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    alignSelf: 'stretch'
  },
  pressed: {
    opacity: 0.8,
  },
  // Primary variant (blue background, white text)
  primary: {
    backgroundColor: COLORS.blue,
  },
  disabledPrimary: {
    backgroundColor: COLORS.accent,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabledDanger: {
    backgroundColor: '#ff6c6cff',
  },
  primaryText: {
    color: COLORS.white,
    fontFamily: 'SemiBold',
    fontSize: 16,
  },
  // Secondary variant (transparent, black border)
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  disabledSecondary: {
    borderColor: '#999',
  },
  secondaryText: {
    color: COLORS.black,
    fontFamily: 'SemiBold',
    fontSize: 16,
  },
});
