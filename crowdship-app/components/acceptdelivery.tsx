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
import modalStyles from "../styles/modalStyles";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

// Import your local image from the assets folder
import diningTableImage from "../assets/diningTable.png";
import fontStyles from "../styles/fontStyles";
import buttonStyles from "../styles/buttonStyles";
import { format, addHours, parseISO } from "date-fns";

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
  pickupdatetime: string;
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
  const [customPrice, setCustomPrice] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
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

  // console.log("time", selectedListing.pickupdatetime);
  // console.log(
  //   "new time",
  //   format(
  //     addHours(parseISO(selectedListing.pickupdatetime), 24),
  //     "yyyy-MM-dd HH:mm:ss"
  //   )
  // );
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
          <View style={styles.card}>
            <AntDesign name="clockcircleo" size={24} color="black" />
            <View style={styles.cardContent}>
              <Text style={fontStyles.boldedText}>Pick Up Date and Time</Text>
              <Text style={fontStyles.greyText}>
                {selectedListing.pickupdatetime
                  ? format(
                      addHours(parseISO(selectedListing.pickupdatetime), 24),
                      "yyyy-MM-dd HH:mm a"
                    )
                  : "Not available"}
              </Text>
            </View>
          </View>
        </View>

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

        <View style={styles.negotiateHeader}>
          <Text style={fontStyles.h1}>Negotiate Offer</Text>
        </View>

        <View style={styles.negotiationButtonsContainer}>
          <View>
            <TouchableOpacity
              style={[
                selectedButton === 0
                  ? styles.selectedButton
                  : styles.negotiateButton,
              ]}
              onPress={() => setSelectedButton(0)}
            >
              <Text style={buttonStyles.tertiaryButtonText}>
                ${(selectedListing.price * 1.1).toFixed(2)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.labelText}>10% increase</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                selectedButton === 1
                  ? styles.selectedButton
                  : styles.negotiateButton,
              ]}
              onPress={() => setSelectedButton(1)}
            >
              <Text style={buttonStyles.tertiaryButtonText}>
                ${(selectedListing.price * 1.15).toFixed(2)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.labelText}>15% increase</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                selectedButton === 2
                  ? styles.selectedButton
                  : styles.negotiateButton,
              ]}
              onPress={() => setSelectedButton(2)}
            >
              <Text style={buttonStyles.tertiaryButtonText}>
                ${(selectedListing.price * 1.2).toFixed(2)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.labelText}>20% increase</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.card}>
            <Feather name="dollar-sign" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Add custom price"
              value={customPrice}
              onChangeText={(text) => setCustomPrice(text)}
              multiline={true}
              numberOfLines={2}
            />
          </View>
        </View>

        <TouchableOpacity
          style={buttonStyles.secondaryButton}
          onPress={() => newOrder(selectedListing)}
        >
          <Text style={buttonStyles.buttonText}>Send New Offer</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={renderAcceptDeliveryConfirmation}
        animationType="slide"
        transparent={true}
      >
        <View style={modalStyles.modalContainer}>
          <View
            style={[modalStyles.modalContent, { width: "90%", height: "20%" }]}
          >
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
        </View>
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
  },
  uploadContainer: {
    width: "75%",
    height: 175,
    backgroundColor: "#dde8ff",
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
    backgroundColor: "transparent",
    borderWidth: 1,
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
    justifyContent: "center",
  },
  cardContent: {
    marginLeft: 15,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    marginTop: 20,
  },
  negotiationButtonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  negotiateButton: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#7F8A94",
  },
  selectedButton: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#47BF7E",
  },
  buttonWithLabel: {
    alignItems: "center",
    width: "100%",
  },
  labelText: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
    marginLeft: 15,
  },
  inputWithIcon: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "black",
  },
});

export default AcceptDelivery;
