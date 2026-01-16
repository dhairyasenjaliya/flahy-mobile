import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ 
  label, 
  error, 
  className,
  style,
  ...props 
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-text-primary font-medium mb-2 text-base">
          {label}
        </Text>
      )}
      <View 
        className={`bg-white border rounded-xl overflow-hidden h-14 justify-center px-4 ${
          error ? 'border-red-500' : 'border-gray-400'
        }`}
      >
        <TextInput
          className="text-text-primary text-base h-full p-0 flex-1 font-medium"
          placeholderTextColor="#A0A0A0"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
};
