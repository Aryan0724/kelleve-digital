import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/auth';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#0F172A',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: '#F8FAFC',
            },
          }}
        >
          {/* Main Bottom Tabs Group */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Auth Screen Group */}
          <Stack.Screen name="(auth)/login" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="(auth)/register" options={{ headerShown: false, gestureEnabled: false }} />
          
          {/* Listing Details (dynamic path) */}
          <Stack.Screen 
            name="listing/[slug]" 
            options={{ 
              title: 'Business Details',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
            }} 
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
