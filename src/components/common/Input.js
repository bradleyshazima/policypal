import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  containerStyle,
  inputStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
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
    fontSize: 14,
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
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.danger,
    fontFamily: 'Regular',
  },
});
