import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { FlahyAIScreen } from '../screens/FlahyAIScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{ presentation: 'modal' }} // Nice modal effect for actions
      />
      <Stack.Screen 
        name="FlahyAI" 
        component={FlahyAIScreen} 
        options={{ animation: 'slide_from_right' }} // Slide in like a new page
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{ presentation: 'modal' }} 
      />
      {/* Add Camera and ReportViewer here */}
    </Stack.Navigator>
  );
};
