import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          placeholderTextColor="#A0A0A0"
          style={[styles.input, style]}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: colors['text-primary'],
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    color: colors['text-primary'],
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
