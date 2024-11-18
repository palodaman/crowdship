import React, { useState, useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { useSession } from "../hooks/useSession";
import Path from "../components/Path";
import { useRouter } from "expo-router";

const _layout = () => {
  const session = useSession();
  const router = useRouter();
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    if (route && navbarVisible) {
      router.push(route);
    }
  }, [route, navbarVisible, router]);

  const handleButtonPress = (buttonRoute: string) => {
    setNavbarVisible(true); 
    setRoute(buttonRoute);
  };

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
    <>
      {navbarVisible && (
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
      )}

      {!navbarVisible && <Path onButtonPress={handleButtonPress} />}
    </>
  );
};

export default _layout;