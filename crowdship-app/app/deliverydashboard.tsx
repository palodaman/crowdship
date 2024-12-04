import React, { useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Button } from "@rneui/themed";
import SenderDashboard from "../components/senderdashboard";
import DriverDashboard from "../components/driverdashboard";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

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
  notes: string | null;
}

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState("deliveries");
  const [activeShipments, setActiveShipments] = useState<Listing[]>([]);
  const [pastShipments, setPastShipments] = useState<Listing[]>([]);
  const [inProgressShipments, setInProgressShipments] = useState<Listing[]>([]);
  const [activeOrders, setActiveOrders] = useState<Listing[]>([]);
  const [pastOrders, setPastOrders] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      fetchAllOrders();
      fetchAllShipments();
    }, [])
  );

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      await fetchActiveOrders(data.user);
      await fetchPastOrders(data.user);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const fetchActiveOrders = async (user: User | null) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("listings (*)")
        .eq("delivererid", user?.id)
        .eq("status", "ACCEPTED");
      const listingsArray = data ? data.flatMap((order) => order.listings) : [];
      setActiveOrders(listingsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPastOrders = async (user: User | null) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("listings (*)")
        .eq("delivererid", user?.id)
        .eq("status", "COMPLETE");

      const listingsArray = data ? data.flatMap((order) => order.listings) : [];
      setPastOrders(listingsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllShipments = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      console.log("fetchAllShipments user", data);
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .eq("senderid", data.user?.id)
        .in("status", ["ACTIVE", "CLAIMED", "INACTIVE"]);

      if (listingsError) throw listingsError;

      // Filter results locally to categorize shipments
      const active = listingsData.filter(
        (listing) => listing.status === "ACTIVE"
      );
      const inProgress = listingsData.filter(
        (listing) => listing.status === "CLAIMED"
      );
      const past = listingsData.filter(
        (listing) => listing.status === "INACTIVE"
      );

      setActiveShipments(active);
      setInProgressShipments(inProgress);
      setPastShipments(past);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === "deliveries" ? "#47BF7E" : "#7F8A9480",
            },
          ]}
          onPress={() => setActiveTab("deliveries")}
        >
          <Text
            style={[
              styles.tabText,
              {
                fontWeight: activeTab === "deliveries" ? "bold" : "normal",
              },
            ]}
          >
            My Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === "packages" ? "#47BF7E" : "#7F8A9480",
            },
          ]}
          onPress={() => setActiveTab("packages")}
        >
          <Text
            style={[
              styles.tabText,
              {
                fontWeight: activeTab === "packages" ? "bold" : "normal",
              },
            ]}
          >
            My Packages
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listingsContainer}>
        {activeTab === "deliveries" ? (
          <DriverDashboard
            activeOrders={activeOrders}
            pastOrders={pastOrders}
            fetchAllOrders={fetchAllOrders}
            loading={loading}
          />
        ) : (
          <SenderDashboard
            activeShipments={activeShipments}
            pastShipments={pastShipments}
            inProgressShipments={inProgressShipments}
            fetchAllShipments={fetchAllShipments}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    color: "#F2F6F3",
    fontSize: 16,
  },
  listingsContainer: {
    flex: 1,
  },
});

export default DeliveryDashboard;

/*This code was developed with the assistance of ChatGPT and Copilot*/
