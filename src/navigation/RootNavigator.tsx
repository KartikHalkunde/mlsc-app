import React from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { useStudent } from '../context/UserContext';
import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { EventDetailsScreen } from '../screens/EventDetailsScreen';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { ClubProfileScreen } from '../screens/ClubProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ChatConversationScreen } from '../screens/ChatConversationScreen';
import { ListScreen } from '../screens/ListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabName = 'Home' | 'Events' | 'Search' | 'Chat' | 'Profile';

const tabConfig: Record<TabName, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Events: { active: 'calendar', inactive: 'calendar-outline' },
  Search: { active: 'search', inactive: 'search-outline' },
  Chat: { active: 'chatbubbles', inactive: 'chatbubble-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          height: 64,
          backgroundColor: '#FFFFFF',
          borderRadius: 32,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarButton: BouncyTabBarButton,
        tabBarIcon: ({ focused }) => {
          const config = tabConfig[route.name as TabName];
          return (
            <View style={s.iconWrap}>
              <Ionicons
                name={(focused ? config.active : config.inactive) as any}
                size={24}
                color={focused ? colors.primary : colors.onSurfaceVariant}
              />
              {focused && <View style={s.activeDot} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={CalendarScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: -4,
  },
});

const BouncyTabBarButton = (props: any) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const { href, style, children, onPressIn, onPressOut, onPress, ...rest } = props;
  
  return (
    <Pressable
      {...rest}
      onPress={(e: any) => {
        if (e && e.preventDefault) e.preventDefault();
        if (onPress) onPress(e);
      }}
      onPressIn={(e) => {
        Animated.spring(scale, { toValue: 0.85, useNativeDriver: true }).start();
        if (onPressIn) onPressIn(e);
      }}
      onPressOut={(e) => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 50 }).start();
        if (onPressOut) onPressOut(e);
      }}
      style={style}
    >
      <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export function RootNavigator() {
  const { student } = useStudent();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!student ? (
          <Stack.Screen name="Welcome" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Campus" component={Tabs} />
            <Stack.Screen name="Event" component={EventDetailsScreen} />
            <Stack.Screen name="Enroll" component={RegistrationScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="ClubProfile" component={ClubProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
            <Stack.Screen name="List" component={ListScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
