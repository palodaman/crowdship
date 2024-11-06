import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import { Button } from "@rneui/themed";
import { User } from "@supabase/supabase-js";
import { useFocusEffect } from "@react-navigation/native";
import SenderDashboard from "../components/senderdashboard";
import DriverDashboard from "../components/driverdashboard";

interface Listing {
  delivererid: string;
  listingid: string;
  senderid: string;
  status: string;
  price: number;
  views: string;
  startingaddress: string;
  destinationaddress: string;
  itemdescription: string;
  itemimageurl: string | null;
}

const DeliveryDashboard = () => {
  // const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deliveries");

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center" }}>
  //       <ActivityIndicator size="large" color="#d3d3d3" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Button
          style={{
            paddingRight: 1,
            backgroundColor:
              activeTab === "deliveries" ? "#2089DC" : "lightgray",
          }}
          onPress={() => {
            setActiveTab("deliveries");
          }}
          color="transparent"
        >
          My Deliveries
        </Button>
        <Button
          style={{
            paddingRight: 1,
            backgroundColor: activeTab === "packages" ? "#2089DC" : "lightgray",
          }}
          onPress={() => {
            setActiveTab("packages");
          }}
          color="transparent"
        >
          My Packages
        </Button>
      </View>

      <View style={styles.listingsContainer}>
      {activeTab === 'deliveries' ? <DriverDashboard /> : <SenderDashboard />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listingsContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabs: {
    paddingTop: 16,
    flexDirection: "row",
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 16,
  },
  itemDescription: {
    flex: 1,
  },
  itemDistance: {
    alignItems: "flex-end",
    flex: 1,
  },
  itemText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  itemPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4CAF50", // Green for price
    marginLeft: 5,
  },
  distanceText: {
    color: "#888",
    fontSize: 14,
    textAlign: "right",
  },
  noDeliveriesContainer: {
    alignItems: "center",
    padding: "10%",
  },
  noDeliveriesText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveryDashboard;
