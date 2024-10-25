import React from "react";
import { Tabs, useRouter } from "expo-router";
import TabBar from "../components/TabBar";
import { useSession } from "../hooks/useSession";
import Auth from "../components/Auth";
import App from "./index";

const _layout = () => {
  const session = useSession()
  if (session?.user == undefined || null) {
    return <App/>
  }
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
          title: "Deliveries",
        }}
      />
    </Tabs>
  );
};

export default _layout;
 