import React from 'react';
import { ViewStyle } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  edges?: Edges; // Correct type from the library
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  style, 
  className,
  edges = ['top', 'left', 'right', 'bottom'] // Default value matches Edges type
}) => {
  return (
    <SafeAreaView 
      style={[{ flex: 1 }, style]} 
      className={className} 
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};
