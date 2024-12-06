import React, { useState, useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import TabBar from "../components/TabBar";
import { useSession } from "../hooks/useSession";
import Path from "../components/Path";
import { useRouter } from "expo-router";
import { Image } from "react-native";

const _layout = () => {
  const session = useSession();
  const router = useRouter();
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [route, setRoute] = useState<string | null>(null);

  const HeaderRightImage = () => (
    <Image
      source={require("../assets/logo.png")}
      style={{ width: 30, height: 30, marginRight: 10 }}
    />
  );

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
              title: "Profile",
              headerRight: () => <HeaderRightImage />,
            }}
          />
          <Tabs.Screen
            name="deliveryrequest"
            options={{
              title: "Send Packages",
              headerRight: () => <HeaderRightImage />,
            }}
          />
          <Tabs.Screen
            name="googlemapscreen"
            options={{
              title: "Find Deliveries",
              headerRight: () => <HeaderRightImage />,
            }}
          />
          <Tabs.Screen
            name="deliverydashboard"
            options={{
              title: "Orders",
              headerRight: () => <HeaderRightImage />,
            }}
          />
          <Tabs.Screen
            name="chats"
            options={{
              title: "Chats",
              headerRight: () => <HeaderRightImage />,
            }}
          />
          <Tabs.Screen
          name="feedback"
            options={{
              title: "Feedback",
              headerRight: () => <HeaderRightImage />,
            }}>
          </Tabs.Screen>
          <Tabs.Screen
          name="chatscreen"
            options={{
              title: "Chat",
              headerRight: () => <HeaderRightImage />,
            }}>
          </Tabs.Screen>
        </Tabs>
      )}

      {!navbarVisible && <Path onButtonPress={handleButtonPress} />}
    </>
  );
};

export default _layout;

/*This code was developed with the assistance of ChatGPT and Copilot*/
