import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const C = Colors[colorScheme];

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,

          // Frosted slab drawn by this component
          tabBarBackground: () => <TabBarBackground />,

          tabBarActiveTintColor: C.tabIconSelected,
          tabBarInactiveTintColor: C.tabIconDefault,
          tabBarLabelStyle: {
            fontSize: 11,
            letterSpacing: 0.4,
            marginBottom: Platform.OS === 'ios' ? -2 : 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },

          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              height: 72,
              marginHorizontal: 16,
              marginBottom: 10,
              borderRadius: 22,
              overflow: 'hidden',
              // soft outer glow
              shadowColor: C.hudCyan,
              shadowOpacity: 0.22,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
            },
            android: {
              backgroundColor: C.dockBg,
              height: 70,
              elevation: 12,
              borderTopWidth: 0,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                size={26}
                name="house.fill"
                color={color}
                weight={focused ? 'semibold' : 'regular'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol
                size={26}
                name="paperplane.fill"
                color={color}
                weight={focused ? 'semibold' : 'regular'}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}