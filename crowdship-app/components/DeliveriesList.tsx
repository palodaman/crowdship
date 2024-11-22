import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import Card from "./Card";
import AcceptDelivery from "./acceptdelivery";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import modalStyles from "../styles/modalStyles";
import { User } from "@supabase/supabase-js";
import fontStyles from "../styles/fontStyles";

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
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderAcceptDelivery, setRenderAcceptDelivery] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [handleAccept, setHandleAccept] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyCIUk8AvslqD49GmsyLs19xaxvREx1R9PE";

  useEffect(() => {
    fetchUser();
  });

  useEffect(() => {
    if (user) {
      fetchListings(latitude, longitude);
    }
  }, [user, latitude, longitude]);

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  const handlePress = (item: Listing) => {
    setSelectedListing(item);
    setRenderAcceptDelivery(true);
  };

  async function fetchListings(latitude: number, longitude: number) {
    try {
      // Fetch listings from Supabase
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "ACTIVE")
        .neq("senderid", user?.id);

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
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#d3d3d3" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.listingid}
        contentContainerStyle={{ paddingBottom: 54 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={{ alignItems: "center" }}>
              <Card>
                <View style={styles.itemContainer}>
                  {
                    <View style={styles.itemImage}>
                      <Ionicons name="image-outline" size={30} color="#ccc" />
                    </View>
                  }
                  <View style={styles.itemDescription}>
                    <Text style={fontStyles.boldedText}>
                      Item: {item.itemdescription}
                    </Text>
                    <View style={styles.itemPrice}>
                      <Ionicons
                        name="pricetag-outline"
                        size={16}
                        color="#5DE49B"
                      />
                      <Text style={fontStyles.greenText}>${item.price}</Text>
                    </View>
                  </View>
                  <View style={styles.itemDistance}>
                    <Text style={[fontStyles.greyText, { textAlign: "right" }]}>
                      Distance from destination
                    </Text>
                    <Text style={fontStyles.greyText}>
                      {" "}
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#888"
                      />{" "}
                      {item.distance?.toFixed(0)} km
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
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
                onAccept={() => fetchListings(latitude, longitude)}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign: "right",
    flex: 1,
  },
  itemPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});

export default DeliveriesList;
