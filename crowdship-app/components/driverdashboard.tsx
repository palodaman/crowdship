import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import modalStyles from "../styles/modalStyles";
import DefaultDeliveryModal from "./DefaultDeliveryModal";
import CompleteDeliveryModal from "./CompleteDeliveryModal";
import fontStyles from "../styles/fontStyles";
import SubmitReviewModal from "./SubmitReviewModal";
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

interface DriverDashboardProps {
  activeOrders: Listing[];
  pastOrders: Listing[];
  fetchAllOrders: () => void;
  loading: boolean;
}

type ReviewData = {
  orderid: string;
  delivererid: string;
  senderid: string;
  reviewtype: string;
};

const DriverDashboard: React.FC<DriverDashboardProps> = ({
  activeOrders,
  pastOrders,
  fetchAllOrders,
  loading,
}) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [renderModal, setRenderModal] = useState<boolean>(false);
  const [renderCompleteDelivery, setRenderCompleteDelivery] = useState<boolean>(false);
  const [renderReviewModal, setRenderReviewModal] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null); // New state for fetched order details

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

  const fetchOrderDetails = async (item: Listing) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('orderid, delivererid')
        .eq('listingid', item.listingid);
  
      if (error) {
        console.error('Error fetching order details:', error);
      }
  
      return data?.[0];
    } catch (error) {
    }
  };

  const handleReviewButtonPress = async (item: Listing) => {
    setSelectedListing(item);
    const data = await fetchOrderDetails(item);
    if (data) {
      setReviewData({
        orderid: data.orderid,
        delivererid: data.delivererid,
        senderid: item.senderid,
        reviewtype: "drivertosender"
      });
      setRenderReviewModal(true);
    }
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
      <ScrollView persistentScrollbar={true}>
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
                        <Text style={fontStyles.boldedText}>
                          {item.itemdescription}
                        </Text>
                        <Text style={fontStyles.greyText}>{item.status}</Text>
                        <View style={styles.itemPrice}>
                          <Ionicons
                            name="pricetag-outline"
                            size={16}
                            color="#47BF7E"
                          />
                          <Text style={fontStyles.greenText}>${item.price}</Text>
                        </View>
                      </View>
                      <Button
                        onPress={() => handleCompleteButtonPress(item)}
                        color={"#47BF7E"}
                      >
                        Complete
                      </Button>
                    </View>
                  </Card>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDeliveriesContainer}>
              <Text style={fontStyles.text}>No deliveries in progress</Text>
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
                        <Text style={fontStyles.boldedText}>
                          {item.itemdescription}
                        </Text>
                        <Text style={fontStyles.greyText}>DELIVERED</Text>
                        <View style={styles.itemPrice}>
                          <Ionicons
                            name="pricetag-outline"
                            size={16}
                            color="#47BF7E"
                          />
                          <Text style={fontStyles.greenText}>${item.price}</Text>
                        </View>
                      </View>
                      <Button
                      onPress={() => handleReviewButtonPress(item)}
                      color={"#47BF7E"}
                      >
                        Review
                      </Button>    
                    </View>
                  </Card>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDeliveriesContainer}>
              <Text style={fontStyles.text}>
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
        <Modal
          visible={renderReviewModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setRenderReviewModal(false)}
        >
          <View style={modalStyles.modalContainer}>
            <View style={{ width: "90%" }}>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={() => setRenderReviewModal(false)}
              >
                <Text style={modalStyles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {selectedListing && reviewData && (
                <SubmitReviewModal
                  reviewData={reviewData}
                  onSubmitReview={() => setRenderReviewModal(false)}
                />
              )}
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
  itemPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  noDeliveriesContainer: {
    alignItems: "center",
    padding: "10%",
  },
});

export default React.memo(DriverDashboard);

/*This code was developed with the assistance of ChatGPT and Copilot*/