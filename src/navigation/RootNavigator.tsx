import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { FlahyAIScreen } from '../screens/FlahyAIScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { useAuthStore } from '../store/authStore';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
                name="Upload" 
                component={UploadScreen} 
                options={{ presentation: 'modal' }} 
            />
            <Stack.Screen 
                name="FlahyAI" 
                component={FlahyAIScreen} 
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen 
                name="Reports" 
                component={ReportsScreen} 
                options={{ presentation: 'modal' }} 
            />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
