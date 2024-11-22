import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
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
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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
      setLoading(true);
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
        <Button
          style={{
            paddingRight: 1,
            backgroundColor:
              activeTab === "deliveries" ? "#5DE49B" : "#7F8A9480",
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
            backgroundColor: activeTab === "packages" ? "#5DE49B" : "#7F8A9480",
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
  listingsContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  tabs: {
    paddingTop: 16,
    flexDirection: "row",
  },
});

export default DeliveryDashboard;
