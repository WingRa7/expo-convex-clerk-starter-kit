import { useConvexAuth, useQuery } from "convex/react";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, useColorScheme, Text } from "react-native";

import { HapticTab } from "@/components/ui/HapticTab";
import { api } from "@/convex/_generated/api";
import { Home, Compass, User } from "lucide-react-native";
import { T } from "gt-react-native";

export default function TabLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const colorScheme = useColorScheme();
  
  const tintColor = colorScheme === 'dark' ? '#fff' : '#2696DE';
  const inactiveColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';

  if (!isAuthenticated && (isLoading || user === undefined)) {
    return <ActivityIndicator className="flex-1" size="large" color={tintColor} />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 88,
          paddingTop: 12,
          paddingBottom: 28,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ color }) => (
            <T><Text style={{ color, fontSize: 11, fontWeight: '600', marginTop: 4 }}>Home</Text></T>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: ({ color }) => (
            <T><Text style={{ color, fontSize: 11, fontWeight: '600', marginTop: 4 }}>Explore</Text></T>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Compass size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: ({ color }) => (
            <T><Text style={{ color, fontSize: 11, fontWeight: '600', marginTop: 4 }}>Settings</Text></T>
          ),
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
