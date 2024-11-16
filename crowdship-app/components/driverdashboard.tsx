import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import modalStyles from "../styles/modalStyles";
import DefaultDeliveryModal from "./DefaultDeliveryModal";
import CompleteDeliveryModal from "./CompleteDeliveryModal";

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

interface DriverDashboardProps {
  activeOrders: Listing[];
  pastOrders: Listing[];
  fetchAllOrders: () => void;
  loading: boolean;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({
  activeOrders,
  pastOrders,
  fetchAllOrders,
  loading,
}) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [renderModal, setRenderModal] = useState<boolean>(false);
  const [renderCompleteDelivery, setRenderCompleteDelivery] =
    useState<boolean>(false);

  const handlePress = (item: Listing) => {
    setSelectedListing(item);
    setRenderModal(true);
    setRenderCompleteDelivery(false);
  };

  const handleCompleteButtonPress = async (item: Listing) => {
    setRenderCompleteDelivery(true);
    setSelectedListing(item);
    setRenderModal(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("setRenderCompleteDelivery", renderCompleteDelivery);
  console.log("selectedListing", selectedListing);
  return (
    <View style={styles.container}>
      <View style={{ flexShrink: 1 }}>
        <Text style={styles.header}>In Progress Deliveries</Text>
        {activeOrders.length > 0 ? (
          activeOrders.map((item) => (
            <TouchableOpacity
              key={item.listingid}
              onPress={() => handlePress(item)}
            >
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
                    <Button onPress={() => handleCompleteButtonPress(item)}>
                      Complete
                    </Button>
                  </View>
                </Card>
              </View>
            </TouchableOpacity>
          ))
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
          pastOrders.map((item) => (
            <TouchableOpacity
              key={item.listingid}
              onPress={() => handlePress(item)}
            >
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
                    <Text>DELIVERED</Text>
                  </View>
                </Card>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noDeliveriesContainer}>
            <Text style={styles.noDeliveriesText}>
              No deliveries have been completed
            </Text>
          </View>
        )}
      </View>
      <Modal
        visible={renderModal}
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
              (renderCompleteDelivery ? (
                <CompleteDeliveryModal
                  selectedListing={selectedListing}
                  setRenderModal={setRenderModal}
                  fetchAllOrders={fetchAllOrders}
                />
              ) : (
                <DefaultDeliveryModal
                  selectedListing={selectedListing}
                  setRenderModal={setRenderModal}
                />
              ))}
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
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
  noDeliveriesContainer: {
    alignItems: "center",
    padding: "10%",
  },
  noDeliveriesText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default React.memo(DriverDashboard);
