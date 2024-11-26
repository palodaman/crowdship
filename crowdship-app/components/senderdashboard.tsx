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
import SenderModal from "./SenderModal";
import EditDeliveryModal from "./EditDeliveryModal";
import fontStyles from "../styles/fontStyles";
import ReviewModal from "./ReviewModal";
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

interface SenderDashboardProps {
  activeShipments: Listing[];
  pastShipments: Listing[];
  inProgressShipments: Listing[];
  fetchAllShipments: () => void;
  loading: boolean;
}

type ReviewData = {
  orderid: string;
  delivererid: string;
  senderid: string;
  reviewtype: string;
};

const SenderDashboard: React.FC<SenderDashboardProps> = ({
  activeShipments,
  pastShipments,
  inProgressShipments,
  fetchAllShipments,
  loading,
}) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [renderAcceptDelivery, setRenderModal] = useState<boolean>(false);
  const [renderEditDelivery, setRenderEditDelivery] = useState<boolean>(false);
  const [transactionComplete, setTransactionComplete] = useState("inactive");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [renderReviewModal, setRenderReviewModal] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

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
        reviewtype: "sendertodriver"
      });
      setRenderReviewModal(true);
    }
  };

  const handlePress = (item: Listing, edit: boolean) => {
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

  return (
    <View style={styles.container}>
      <ScrollView persistentScrollbar={true}>
        <View>
          <Text style={styles.header}>Unclaimed Packages</Text>
          {activeShipments.length > 0 ? (
            activeShipments.map((item) => (
              <TouchableOpacity
                key={item.listingid}
                onPress={() => handlePress(item, false)}
              >
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
                          <Text style={fontStyles.greenText}>
                            ${item.price}
                          </Text>
                        </View>
                      </View>
                      <Button
                        onPress={() => {
                          handleEditPress(item, true);
                        }}
                        color={"#47BF7E"}
                      >
                        Edit
                      </Button>
                    </View>
                  </Card>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDeliveriesContainer}>
              <Text style={fontStyles.text}>No packages have been sent</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={styles.header}>Packages in Delivery</Text>
          {inProgressShipments.length > 0 ? (
            inProgressShipments.map((item) => (
              <TouchableOpacity
                key={item.listingid}
                onPress={() => handlePress(item, false)}
              >
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
                        <Text style={fontStyles.boldedText}>
                          {item.itemdescription}
                        </Text>
                        <View style={styles.itemPrice}>
                          <Ionicons
                            name="pricetag-outline"
                            size={16}
                            color="#47BF7E"
                          />
                          <Text style={fontStyles.greenText}>
                            ${item.price}
                          </Text>
                        </View>
                      </View>
                      <Text style={fontStyles.greyText}>CLAIMED</Text>
                    </View>
                  </Card>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDeliveriesContainer}>
              <Text style={fontStyles.text}>No packages have been sent</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={styles.header}>Sent Packages</Text>
          {pastShipments.length > 0 ? (
            pastShipments.map((item) => (
              <TouchableOpacity
                key={item.listingid}
                onPress={() => handlePress(item, false)}
              >
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
                        <Text style={fontStyles.boldedText}>
                          {item.itemdescription}
                        </Text>
                        <Text style={fontStyles.greyText}>SHIPPED</Text>
                        <View style={styles.itemPrice}>
                          <Ionicons
                            name="pricetag-outline"
                            size={16}
                            color="#4CAF50"
                          />
                          <Text style={fontStyles.greenText}>
                            ${item.price}
                          </Text>
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
              <Text style={fontStyles.text}>No packages have been sent</Text>
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
                onPress={() => {
                  setRenderModal(false);
                  if (editMode) {
                    fetchAllShipments();
                    setEditMode(false);
                  }
                }}
              >
                <Text style={modalStyles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {selectedListing &&
                (renderEditDelivery ? (
                  <EditDeliveryModal
                    setEditMode={setEditMode}
                    selectedListing={selectedListing}
                    setRenderModal={setRenderModal}
                    setRenderEditDelivery={setRenderEditDelivery}
                    fetchAllShipments={fetchAllShipments}
                  />
                ) : (
                  <SenderModal
                    selectedListing={selectedListing}
                    setRenderModal={setRenderModal}
                    transactionComplete={transactionComplete}
                    setEditMode={setEditMode}
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
              <ReviewModal
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
    paddingBottom: 90,
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

export default React.memo(SenderDashboard);
