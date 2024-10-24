import React from "react";
import { Tabs, useRouter } from "expo-router";
import TabBar from "../components/TabBar";

const _layout = () => {

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
 