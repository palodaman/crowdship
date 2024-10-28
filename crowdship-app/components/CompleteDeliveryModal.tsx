import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// Import your local image from the assets folder
import diningTableImage from "../assets/diningTable.png";

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

interface CompleteDeliveryModalProps {
  selectedListing: Listing;

  setRenderAcceptDelivery: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompleteDeliveryModal: React.FC<CompleteDeliveryModalProps> = ({
  selectedListing,
  setRenderAcceptDelivery,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (loading) {
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#d3d3d3" />
    </View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          {/* Display the local image */}
          <View
            style={[
              styles.uploadContainer,
              selectedImage && styles.uploadedContainer,
            ]}
          >
            <Image
              source={diningTableImage} // Using the imported image here
              style={styles.itemImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.card}>
            <Icon name="info-circle" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Item Description:</Text>
              <Text style={styles.cardData}>
                {selectedListing.itemdescription || "Not available"}
              </Text>
            </View>
          </View>
          
          <View style={styles.card}>
            <Icon name="location-arrow" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Pickup From:</Text>
              <Text style={styles.cardData}>
                {selectedListing.startingaddress || "Not available"}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Icon name="map-marker" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Deliver To:</Text>
              <Text style={styles.cardData}>
                {selectedListing.destinationaddress || "Not available"}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Icon name="dollar" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>You'll Earn:</Text>
              <Text style={styles.cardData}>
                ${selectedListing.price || "Not available"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  textContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  uploadContainer: {
    width: "75%",
    height: 175,
    backgroundColor: "#dde8ff", // Initial background before image is uploaded
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#4a90e2",
  },
  uploadedContainer: {
    backgroundColor: "transparent", // Remove the hue once image is uploaded
    borderWidth: 1, // Remove the dashed border once image is uploaded
  },
  itemImage: {
    width: "125%",
    height: "125%",
    borderRadius: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardData: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: "10%",
  },
  views: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  numViews: {
    color: "black",
    fontSize: 16,
  },
  button: {
    width: "40%",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CompleteDeliveryModal;
