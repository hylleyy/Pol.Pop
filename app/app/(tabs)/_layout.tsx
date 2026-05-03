import React from 'react';
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface TabIconProps {
  focused: boolean;
  activeIcon: ImageSourcePropType;
  inactiveIcon: ImageSourcePropType;
  color: string; // Add this prop
}

const TabIcon = ({ focused, activeIcon, inactiveIcon, color }: TabIconProps) => {
  return (
    <Image
      source={focused ? activeIcon : inactiveIcon}
      style={{
        width: 24,
        height: 24,
        tintColor: focused ? undefined : color, // This forces the PNG to adopt the color
      }}
      resizeMode="contain"
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // This is the color passed to the tabBarIcon function for inactive tabs
        tabBarInactiveTintColor: colorScheme === 'light' ? '#000000' : '#888888', 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 0,
          shadowColor: '#fff0',
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => ( // 'color' is provided by Expo Router
            <TabIcon
              focused={focused}
              color={color} 
              activeIcon={require('../../assets/images/icons/home-icon-active.png')}
              inactiveIcon={require('../../assets/images/icons/home-icon.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused, color }) => (
          <TabIcon
              focused={focused}
              color={color}
              activeIcon={require('../../assets/images/icons/discovery-icon-active.png')}
              inactiveIcon={require('../../assets/images/icons/discovery-icon.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
          <TabIcon
              focused={focused}
              color={color}
              activeIcon={require('../../assets/images/icons/profile-icon-active.png')}
              inactiveIcon={require('../../assets/images/icons/profile-icon.png')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
