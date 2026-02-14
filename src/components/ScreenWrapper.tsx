import { ViewStyle } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string; // NativeWind support
  edges?: Edges;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  style, 
  className,
  edges = ['top', 'left', 'right', 'bottom']
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
