import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";

import React from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import modalStyles from "../styles/modalStyles";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

// Import your local image from the assets folder
import diningTableImage from "../assets/diningTable.png";
import fontStyles from "../styles/fontStyles";
import buttonStyles from "../styles/buttonStyles";

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

interface AcceptDeliveryProps {
  selectedListing: Listing;
  setRenderAcceptDelivery: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept: () => Promise<void>;
}

const AcceptDelivery: React.FC<AcceptDeliveryProps> = ({
  selectedListing,
  setRenderAcceptDelivery,
  onAccept,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [
    renderAcceptDeliveryConfirmation,
    setRenderAcceptDeliveryConfirmation,
  ] = useState(false);
  const session = useSession();

  const newOrder = async (selectedListing: Listing) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            delivererid: session?.user.id,
            listingid: selectedListing.listingid,
            status: "ACCEPTED",
          },
        ]);

      if (orderError) throw orderError;

      const { data: updatedData, error: updateError } = await supabase
        .from("listings")
        .update({ status: "CLAIMED" })
        .eq("listingid", selectedListing.listingid);

      if (updateError) throw updateError;

      setRenderAcceptDeliveryConfirmation(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setRenderAcceptDelivery(false);
    await onAccept();
  };

  if (loading) {
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#d3d3d3" />
    </View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView persistentScrollbar={true}>
        <View style={styles.textContainer}>
          <Text style={fontStyles.title}>Accept Delivery</Text>
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

          {/* Delivery Information as Cards */}

          <View style={styles.card}>
            <AntDesign name="infocirlceo" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={fontStyles.boldedText}>Item Description</Text>
              <Text style={fontStyles.greyText}>
                {selectedListing.itemdescription || "Not available"}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <AntDesign name="enviroment" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={fontStyles.boldedText}>Pickup From</Text>
              <Text style={fontStyles.greyText}>
                {selectedListing.startingaddress || "Not available"}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <AntDesign name="enviromento" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={fontStyles.boldedText}>Deliver To</Text>
              <Text style={fontStyles.greyText}>
                {selectedListing.destinationaddress || "Not available"}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Feather name="dollar-sign" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={fontStyles.boldedText}>You'll Earn</Text>
              <Text style={fontStyles.greyText}>
                ${selectedListing.price || "Not available"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.negotiateHeader}>
          <Text style={fontStyles.h1}>Negotiate Offer</Text>
        </View>

        <View style={styles.negotiationButtonsContainer}>
          <TouchableOpacity style={styles.negotiateButton}>
            <Text style={buttonStyles.buttonText}>
              ${selectedListing.price + 5}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.negotiateButton}>
            <Text style={buttonStyles.buttonText}>
              ${selectedListing.price + 10}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.negotiateButton, { width: "32%" }]}
            disabled={true}
          >
            <View style={styles.customButtonContainer}>
              <AntDesign
                style={styles.pencilIcon}
                name="edit"
                size={16}
                color="white"
              />
              <TextInput
                style={buttonStyles.buttonText}
                placeholder="Custom"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Buttons and Views */}
        <View style={styles.buttonContainer}>
          <View style={styles.views}>
            <AntDesign name="eyeo" size={20} color="black" />
            <Text style={fontStyles.text}>{selectedListing?.views}</Text>
          </View>

          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={() => newOrder(selectedListing)}
          >
            <Text style={buttonStyles.buttonText}>Accept Initial Offer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={renderAcceptDeliveryConfirmation}
        animationType="slide"
        transparent={true}
      >
        <View style={modalStyles.modalContainer}>
          {/* <View style={[modalStyles.modalContent, styles.modifiedModalStyle]}> */}
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={() => handleAccept()}
          >
            <Text style={modalStyles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={fontStyles.greenText}>{"Delivery Accepted!\n"}</Text>
          <Text style={fontStyles.text}>
            Navigate to active deliveries to view order information.
          </Text>
        </View>
        {/* </View> */}
      </Modal>
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
  negotiateHeader: {
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  negotiationButtonsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  negotiateButton: {
    width: "29%",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#07181D",
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  customButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pencilIcon: {
    paddingRight: 5,
  },
});

export default AcceptDelivery;
