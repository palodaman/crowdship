import React from "react";
import { Stack, Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { useSession } from "../hooks/useSession";

const _layout = () => {
  const session = useSession();

  if (!session?.user) {
    // If the user is not authenticated, show the Stack Navigator with Auth screens
    return (
      <Stack>
        <Stack.Screen
          name="index" // Auth screen is the main screen when the user is not authenticated
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUpScreen" // Sign Up screen as part of the authentication flow
          options={{
            title: "Sign Up", // Add a back button in the navigation header
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    );
  }

  // If the user is authenticated, show the Tabs Navigator with main app screens
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Account",
        }}
      />
      <Tabs.Screen
        name="deliveryrequest"
        options={{
          title: "Request Delivery",
        }}
      />
      <Tabs.Screen
        name="googlemapscreen"
        options={{
          title: "Find Deliveries",
        }}
      />
      <Tabs.Screen
        name="deliverydashboard"
        options={{
          title: "Delivery Dashboard",
        }}
      />
    </Tabs>
  );
};

export default _layout;
