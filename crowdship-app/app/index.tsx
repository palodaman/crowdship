import { useState, useEffect } from "react";
import Auth from "../components/Auth";
import Account from "../components/Account";
import DeliveryRequest from "./deliveryrequest";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../components/header";
import { useSession } from "../hooks/useSession";
import "./cryptoPolyfill.js";

export default function App() {
  const session = useSession();

  // Render the selected page based on currentPage state
  const renderPage = () => {
    if (!session || !session.user) return <Auth />;
    return <Account key={session.user.id} session={session} />;
  };

  return (
    <View style={styles.container}>
      <Header>{renderPage()}</Header>
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
