import Auth from "../components/Auth";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import Header from "../components/header";
import { useSession } from "../hooks/useSession";
import { useState, useEffect } from 'react';
import "./cryptoPolyfill.js";
import Account from "../components/Account";
import Path from "../components/Path";


export default function App() {
    const session = useSession();
    const [currentPage, setCurrentPage] = useState<'auth' | 'path' | 'account'>('path');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (session && session.user) {
        setLoading(false);
      }
    }, [session]);

  const handleButtonPress = () => {
    setCurrentPage('account');
  };

  // Render the selected page based on currentPage state
  const renderPage = () => {
    
    if (loading) {
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="small" color="#d3d3d3" />
      </View>;
    }

    if (!session || !session.user) return <Auth />;
    else if (currentPage === 'path') {
      return <Path onButtonPress={handleButtonPress} />
    }
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
