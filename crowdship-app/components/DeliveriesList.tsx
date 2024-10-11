import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { supabase } from "../lib/supabase";
import Card from "./Card";
import AcceptDelivery from "../app/acceptdelivery";
import React from "react";

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "grey",
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: "gray",
    borderRadius: 25,
    marginRight: 16,
  },
  itemDescription: {
    flex: 1,
  },
  itemDistance: {
    marginLeft: 16,
  },
});

interface Listing {
  listingid: string;
  senderid: string;
  status: string;
  price: number;
  views: string;
  startingaddress: string;
  destinationaddress: string;
  itemdescription: string;
  itemimageurl: string | null;
  distance?: number;
}

const DeliveriesList: React.FC<{ latitude: number; longitude: number }> = ({
  latitude,
  longitude,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderAcceptDelivery, setRenderAcceptDelivery] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const GOOGLE_MAPS_API_KEY = "AIzaSyBJ9ncuQDRBwkj1EnvsGxVDuhJRrA0s_Fk";

  useEffect(() => {
    fetchListings(latitude, longitude);
  }, [latitude, longitude]);

  const handlePress = (item: Listing) => {
    setSelectedListing(item);
    setRenderAcceptDelivery(true);
  };

  async function fetchListings(latitude: number, longitude: number) {
    try {
      // Fetch listings from Supabase
      const { data, error } = await supabase.from("listings").select("*");

      if (error) throw error;

      // Calculate distances
      const listingsWithDistances = await Promise.all(
        data.map(async (listing) => {
          const { lat, lng } = await getLatLngFromAddress(
            listing.destinationaddress
          );

          const distance = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            lat,
            lng
          );
          listing.distance = distance;
          return { ...listing, distance };
        })
      );
      // Sort listings by distance
      listingsWithDistances.sort(
        (a, b) => (a.distance ?? 0) - (b.distance ?? 0)
      );
      setListings(listingsWithDistances);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function getLatLngFromAddress(address: string) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error("Address not found");
    }
  }

  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ padding: 10 }}
        data={listings}
        keyExtractor={(item) => item.listingid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <Card>
              <View style={styles.item}>
                <Text style={styles.itemImage}>Pic</Text>
                <View style={styles.itemDescription}>
                  <Text>Item: {item.itemdescription}</Text>
                  <Text>Price: ${item.price}</Text>
                </View>
                <Text style={styles.itemDistance}>
                  {item.distance?.toFixed(0)} km
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={renderAcceptDelivery}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRenderAcceptDelivery(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={() => setRenderAcceptDelivery(false)}
            >
              <Text style={modalStyles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {selectedListing && (
              <AcceptDelivery
                selectedListing={selectedListing}
                setRenderAcceptDelivery={setRenderAcceptDelivery}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeliveriesList;
