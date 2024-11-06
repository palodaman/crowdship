import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import Card from "./Card";
import { User } from "@supabase/supabase-js";
import modalStyles from "../styles/modalStyles";
import CompleteDeliveryModal from "./CompleteDeliveryModal";

const DriverDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeOrders, setActiveOrders] = useState<Listing[]>([]);
  const [pastOrders, setPastOrders] = useState<Listing[]>([]);
  const [renderAcceptDelivery, setRenderAcceptDelivery] =
    useState<boolean>(false);

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

  useFocusEffect(
    React.useCallback(() => {
      fetchAllOrders();
    }, [])
  );

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      await fetchActiveOrders(data.user);
      await fetchPastOrders(data.user);
    } catch (error) {
      console.error(error);
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
    } finally {
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item: Listing) => {
    console.log("Item:", item);
    setSelectedListing(item);
    setRenderAcceptDelivery(true);
  };

  const handleButtonPress = async (listingid: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "COMPLETE" })
        .eq("listingid", listingid);

      if (error) throw error;

      fetchAllOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // console.log("Past Orders:", pastOrders);
  // console.log("Active Orders:", activeOrders);
  return (
    <View style={styles.container}>
      <View style={{ flexShrink: 1 }}>
        <Text style={styles.header}>Current Deliveries</Text>
        {activeOrders.length > 0 ? (
          <FlatList
            data={activeOrders}
            keyExtractor={(item) => item.listingid.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={{ alignItems: "center" }}>
                  <Card>
                    <View style={styles.itemContainer}>
                      <View style={styles.itemImage}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                      </View>
                      <View style={styles.itemDescription}>
                        <Text style={styles.itemText}>
                          {item.itemdescription}
                        </Text>
                        <Text>{item.status}</Text>
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
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noDeliveriesContainer}>
            <Text style={styles.noDeliveriesText}>
              No deliveries in progress
            </Text>
          </View>
        )}
      </View>
      <View style={{ flexShrink: 1 }}>
        <Text style={styles.header}>Past Deliveries</Text>
        {pastOrders.length > 0 ? (
          <FlatList
            data={pastOrders}
            keyExtractor={(item) => item.listingid.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={{ alignItems: "center" }}>
                  <Card>
                    <View style={styles.itemContainer}>
                      <View style={styles.itemImage}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                      </View>
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
                      <Text>COMPLETE</Text>
                    </View>
                  </Card>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noDeliveriesContainer}>
            <Text style={styles.noDeliveriesText}>
              No deliveries have been completed
            </Text>
          </View>
        )}
      </View>
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
              <CompleteDeliveryModal
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  deliveryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
    color: "#4CAF50",
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

export default DriverDashboard;