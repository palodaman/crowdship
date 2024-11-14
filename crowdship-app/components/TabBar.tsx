import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  const primaryColor = "#0891b2";
  const greyColor = "#737373";
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label;
        let icon;
        if (route.name === "deliveryrequest") {
          label = "Request Delivery";
          icon = <Entypo name="add-to-list" size={24} color="black" />;
        }
        if (route.name === "googlemapscreen") {
          label = "Find Deliveries";
          icon = <AntDesign name="car" size={24} color="black" />;
        }
        if (route.name === "deliverydashboard") {
          label = "Delivery Dashboard";
          icon = <Feather name="list" size={24} color="black" />;
        }
        if (route.name === "index") {
          label = "Account";
          icon = <FontAwesome name="user" size={24} color="black" />;
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
            color={isFocused ? primaryColor : greyColor}
            label={label!}
          />
        );

        // return (
        //   <TouchableOpacity
        //     key={route.name}
        //     style={styles.tabbarItem}
        //     accessibilityRole="button"
        //     accessibilityState={isFocused ? { selected: true } : {}}
        //     accessibilityLabel={options.tabBarAccessibilityLabel}
        //     testID={options.tabBarTestID}
        //     onPress={onPress}
        //     onLongPress={onLongPress}
        //   >
        //     {
        //         icons[route.name]({
        //             color: isFocused? primaryColor: greyColor
        //         })
        //     }
        //     <Text style={{
        //         color: isFocused ? primaryColor : greyColor,
        //         fontSize: 11
        //     }}>
        //       {label}
        //     </Text>
        //   </TouchableOpacity>
        // );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
