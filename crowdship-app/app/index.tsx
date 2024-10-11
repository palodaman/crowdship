import { useState } from "react";
import Auth from "../components/Auth";
import Account from "../components/Account";
import DeliveryRequest from "./deliveryrequest";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Header from "../components/header";
import { useSession } from "../hooks/useSession";
import AcceptDelivery from "./acceptdelivery";
import GoogleMapScreen from "../components/GoogleMapScreen";

export default function App() {
  const session = useSession();
  const [currentPage, setCurrentPage] = useState<string>("account"); // Track the current page

  // Render the selected page based on currentPage state
  const renderPage = () => {
    if (!session || !session.user) return <Auth />;
    if (currentPage === "account")
      return <Account key={session.user.id} session={session} />;
    if (currentPage === "requestdelivery")
      return (
        // <ScrollView contentContainerStyle={styles.scrollContainer}>
        <DeliveryRequest />
        // </ScrollView>
      );
    if (currentPage === "acceptdelivery")
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* <AcceptDelivery />   */}
          <GoogleMapScreen />
        </ScrollView>
      );
    return <Account key={session.user.id} session={session} />;
  };

  return (
    <View style={styles.container}>
      <Header>
        {/* Render the selected page */}
        {renderPage()}
      </Header>
      {session && session.user && (
        <View style={styles.navBar}>
          {/* Navigation Buttons */}
          <TouchableOpacity
            style={[
              styles.navButton,
              currentPage === "requestdelivery" && styles.activeButton,
            ]}
            onPress={() => setCurrentPage("requestdelivery")}
          >
            <Text
              style={[
                styles.navButtonText,
                currentPage === "requestdelivery" && styles.activeButtonText,
              ]}
            >
              Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentPage === "acceptdelivery" && styles.activeButton,
            ]}
            onPress={() => setCurrentPage("acceptdelivery")}
          >
            <Text
              style={[
                styles.navButtonText,
                currentPage === "acceptdelivery" && styles.activeButtonText,
              ]}
            >
              {" "}
              Deliveries
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentPage === "account" && styles.activeButton,
            ]}
            onPress={() => setCurrentPage("account")}
          >
            <Text
              style={[
                styles.navButtonText,
                currentPage === "account" && styles.activeButtonText,
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60, // Add space at the bottom to avoid overlap with the navbar
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    color: "#888",
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  activeButtonText: {
    color: "#007bff",
  },
});
