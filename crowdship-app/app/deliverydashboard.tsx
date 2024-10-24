import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Button } from "@rneui/themed";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";

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
}

const DeliveryDashboard = () => {
  const [pastListings, setPastListings] = useState<Listing[]>([]);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchActiveListings();
    fetchPastListings();
  }, []);

  const handleButtonPress = async (listingid: string) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .update({ status: "INACTIVE" })
        .eq("listingid", listingid);
      if (error) {
        throw error;
      }
      fetchActiveListings();
      fetchPastListings();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActiveListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "ACTIVE");
      if (error) {
        throw error;
      }
      setActiveListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "INACTIVE");
      if (error) {
        throw error;
      }
      setPastListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#d3d3d3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Button
          style={{ paddingRight: 1 }}
          onPress={() => setActiveTab("active")}
        >
          Active Deliveries
        </Button>
        <Button onPress={() => setActiveTab("past")}>Past Deliveries</Button>
      </View>
      <View style={styles.listingsContainer}>
        {activeTab === "active" ? (
          <FlatList
            data={activeListings}
            keyExtractor={(item) => item.listingid}
            renderItem={({ item }) => (
              <View style={{ alignItems: "center" }}>
                <Card>
                  <View style={styles.itemContainer}>
                    {
                      <View style={styles.itemImage}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                      </View>
                    }
                    <View style={styles.itemDescription}>
                      <Text style={styles.itemText}>
                        {item.itemdescription}
                      </Text>
                      <View style={styles.itemPrice}>
                        <Ionicons
                          name="pricetag-outline"
                          size={16}
                          color="#4CAF50"
                        />
                        <Text style={styles.priceText}>${item.price}</Text>
                      </View>
                    </View>
                    <Button onPress={() => handleButtonPress(item.listingid)}>
                      Complete
                    </Button>
                  </View>
                </Card>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={pastListings}
            keyExtractor={(item) => item.listingid}
            renderItem={({ item }) => (
              <View style={{ alignItems: "center" }}>
                <Card>
                  <View style={styles.itemContainer}>
                    {
                      <View style={styles.itemImage}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                      </View>
                    }
                    <View style={styles.itemDescription}>
                      <Text style={styles.itemText}>
                        {item.itemdescription}
                      </Text>
                      <View style={styles.itemPrice}>
                        <Ionicons
                          name="pricetag-outline"
                          size={16}
                          color="#4CAF50"
                        />
                        <Text style={styles.priceText}>${item.price}</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            )}
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
    backgroundColor: "#288cdc",
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
});

export default DeliveryDashboard;
