import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { DashboardScreen } from '../screens/DashboardScreen';
import { FlahyAIScreen } from '../screens/FlahyAIScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
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
