import React from 'react';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

import { Image, ImageSourcePropType } from 'react-native';

interface TabIconProps {
  focused: boolean;
  activeIcon: ImageSourcePropType;
  inactiveIcon: ImageSourcePropType;
}

const TabIcon = ({ focused, activeIcon, inactiveIcon }: TabIconProps) => {
  return (
    <Image
      source={focused ? activeIcon : inactiveIcon}
      style={{
        width: 24,
        height: 24,
      }}
      resizeMode="contain"
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5, // Adjust this if you want more/less breathing room
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
          <TabIcon
              focused={focused}
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
          tabBarIcon: ({ focused }) => (
          <TabIcon
              focused={focused}
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
          tabBarIcon: ({ focused }) => (
          <TabIcon
              focused={focused}
              activeIcon={require('../../assets/images/icons/profile-icon-active.png')}
              inactiveIcon={require('../../assets/images/icons/profile-icon.png')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
