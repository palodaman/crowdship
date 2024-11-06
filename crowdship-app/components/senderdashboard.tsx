import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import Card from "./Card";
import { User } from "@supabase/supabase-js";
import modalStyles from "../styles/modalStyles";
import CompleteDeliveryModal2 from "./CompleteDeliveryModal2";
import EditDeliveryModal from "./EditDeliveryModal";

const SenderDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeShipments, setActiveShipments] = useState<Listing[]>([]);
  const [pastShipments, setPastShipments] = useState<Listing[]>([]);
  const [inProgressShipments, setInProgressShipments] = useState<Listing[]>([]);
  const [renderAcceptDelivery, setRenderModal] = useState<boolean>(false);
  const [renderEditDelivery, setRenderEditDelivery] = useState<boolean>(false);
  const [transactionComplete, setTransactionComplete] = useState("inactive");

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

  useFocusEffect(
    React.useCallback(() => {
      fetchAllShipments();
    }, [])
  );

  const fetchAllShipments = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      await fetchActiveShipments(data.user);
      await fetchPastShipments(data.user);
      await fetchInProgressShipments(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActiveShipments = async (user: User | null) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("senderid", user?.id)
        .eq("status", "ACTIVE");

      const listingsArray = data || [];
      setActiveShipments(listingsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInProgressShipments = async (user: User | null) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("senderid", user?.id)
        .eq("status", "CLAIMED");

      const listingsArray = data || [];
      setInProgressShipments(listingsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastShipments = async (user: User | null) => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("senderid", user?.id)
        .eq("status", "INACTIVE");

      const listingsArray = data || [];
      setPastShipments(listingsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item: Listing, edit: boolean) => {
    console.log("Item:", item);
    setSelectedListing(item);
    setRenderModal(true);
    setRenderEditDelivery(edit);

    if (item.status === "INACTIVE") {
      setTransactionComplete("inactive");
    } else if (item.status === "CLAIMED") {
      setTransactionComplete("claimed");
    } else {
      setTransactionComplete("active");
    }
  };

  const handleEditPress = (item: Listing, edit: boolean) => {
    console.log("Item:", item);
    setSelectedListing(item);
    setRenderModal(true);
    setRenderEditDelivery(edit);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("activeShipments", activeShipments);
  console.log("pastShipments", pastShipments);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.header}>Unclaimed Shipments</Text>
          {activeShipments.length > 0 ? (
            <FlatList
              data={activeShipments}
              keyExtractor={(item) => item.listingid.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item, false)}>
                  <View style={{ alignItems: "center" }}>
                    <Card>
                      <View style={styles.itemContainer}>
                        {
                          <View style={styles.itemImage}>
                            <Ionicons
                              name="image-outline"
                              size={30}
                              color="#ccc"
                            />
                          </View>
                        }
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
                        <Button onPress={() => handleEditPress(item, true)}>
                          Edit
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
                No shipments in progress
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.header}>In Progress Shipments</Text>
          {inProgressShipments.length > 0 ? (
            <FlatList
              data={inProgressShipments}
              keyExtractor={(item) => item.listingid.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item, false)}>
                  <View style={{ alignItems: "center" }}>
                    <Card>
                      <View style={styles.itemContainer}>
                        {
                          <View style={styles.itemImage}>
                            <Ionicons
                              name="image-outline"
                              size={30}
                              color="#ccc"
                            />
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
                        <Text>CLAIMED</Text>
                      </View>
                    </Card>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noDeliveriesContainer}>
              <Text style={styles.noDeliveriesText}>
                No shipments in progress
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.header}>Past Shipments</Text>
          {pastShipments.length > 0 ? (
            <FlatList
              data={pastShipments}
              keyExtractor={(item) => item.listingid.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item, false)}>
                  <View style={{ alignItems: "center" }}>
                    <Card>
                      <View style={styles.itemContainer}>
                        {
                          <View style={styles.itemImage}>
                            <Ionicons
                              name="image-outline"
                              size={30}
                              color="#ccc"
                            />
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
                        <Text>SHIPPED</Text>
                      </View>
                    </Card>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noDeliveriesContainer}>
              <Text style={styles.noDeliveriesText}>
                No shipments have been completed
              </Text>
            </View>
          )}
        </View>
        <Modal
          visible={renderAcceptDelivery}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setRenderModal(false)}
        >
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalContent}>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={() => setRenderModal(false)}
              >
                <Text style={modalStyles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {selectedListing &&
                (renderEditDelivery ? (
                  <EditDeliveryModal
                    selectedListing={selectedListing}
                    setRenderModal={setRenderModal}
                    setRenderEditDelivery={setRenderEditDelivery}
                  />
                ) : (
                  <CompleteDeliveryModal2
                    selectedListing={selectedListing}
                    setRenderModal={setRenderModal}
                    transactionComplete={transactionComplete}
                  />
                ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 90,
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

export default SenderDashboard;
