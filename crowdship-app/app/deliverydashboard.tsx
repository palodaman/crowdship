import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useDeliveries } from "../components/DeliveriesContext";

const DeliveryDashboard = () => {
  // const { listings } = useDeliveries();

  return (
    <ScrollView style={styles.container}>
      {/* {listings.map((listing) => (
        <View key={listing.listingid} style={styles.card}>
          <Text>{listing.itemdescription}</Text>
          <Text>{listing.status}</Text>
        </View>
      ))} */}
      <Text>Delivery Dashboard</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default DeliveryDashboard;
