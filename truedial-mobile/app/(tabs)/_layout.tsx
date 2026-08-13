import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet, View, Platform } from "react-native";
import { Home, Search, Plus, Users, User } from "lucide-react-native";
import { BlurView } from "expo-blur";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1E40AF", // TrueDial Blue
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="light"
          />
        ),
        headerStyle: {
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E2E8F0",
        },
        headerTintColor: "#0F172A",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={22}
              color={focused ? "#E8701A" : "#64748B"}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Search
              size={22}
              color={focused ? "#E8701A" : "#64748B"}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarLabel: "Post",
          headerShown: false,
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Plus size={24} color="#FFFFFF" strokeWidth={3} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Leads",
          tabBarLabel: "Leads",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={22}
              color={focused ? "#1E40AF" : "#64748B"}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <User
              size={22}
              color={focused ? "#E8701A" : "#64748B"}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          href: null, // Hidden tab, accessible via deep links or internal routing
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent for blur
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.5)",
    height: Platform.OS === "ios" ? 88 : 68,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingTop: 8,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 0, // Remove elevation to prevent interference with blur
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E40AF", // TrueDial Blue
    justifyContent: "center",
    alignItems: "center",
    marginTop: -16,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 6,
    shadowColor: "#0A1C3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
