import { View, StyleSheet } from "react-native";
import React from "react";
import { AntDesign, Feather, Entypo, FontAwesome } from "@expo/vector-icons";
import TabBarButton from "./TabBarButton";

const TabBar = ({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) => {
  // Add this check at the beginning of the component
  const currentRoute = state.routes[state.index].name;
  if (currentRoute === "chatscreen") {
    return null;
  }

  const greyColor = "#737373";
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label = "";
        let icon;
        if (route.name === "deliveryrequest") {
          label = "Send Packages";
          icon = <AntDesign name="gift" size={24} color="black" />;
        }
        if (route.name === "googlemapscreen") {
          label = "Find Deliveries";
          icon = <AntDesign name="search1" size={24} color="black" />;
        }
        if (route.name === "deliverydashboard") {
          label = "Orders";
          icon = <AntDesign name="bars" size={24} color="black" />;
        }
        if (route.name === "index") {
          label = "Profile";
          icon = <AntDesign name="user" size={24} color="black" />;
        }
        // returns null on the tab bar button when signupscreen is the route name passed by expo router props
        if (route.name === "SignUpScreen") {
          return null;
        }
        if (route.name === "chatscreen") {
          return null;
        }
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            icon={icon!}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#5DE49B" : greyColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
