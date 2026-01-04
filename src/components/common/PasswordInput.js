import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function PasswordInput({
  label,
  value,
  onChangeText,
  error,
  placeholder = 'Enter password',
}) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.wrapper, error && styles.inputError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secure}
          style={styles.input}
        />

        <Pressable onPress={() => setSecure(!secure)}>
          <Text style={styles.toggle}>
            {secure ? 'Show' : 'Hide'}
          </Text>
        </Pressable>
      </View>

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
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Regular',
  },
  toggle: {
    color: '#000',
    fontFamily: 'Medium',
  },
  inputError: {
    borderColor: '#E53935',
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#E53935',
  },
});
