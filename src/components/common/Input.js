import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  containerStyle,
  inputStyle,
  keyboardType,
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: SIZES.small,
    fontFamily: 'Medium',
    color: COLORS.black,
  },
  input: {
    height: 52,
    width: '100%',
    borderWidth: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: 'Regular',
    color: COLORS.black,
    borderColor: COLORS.gray
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    marginTop: 4,
    fontSize: SIZES.xsmall,
    color: COLORS.danger,
    fontFamily: 'Regular',
  },
});
