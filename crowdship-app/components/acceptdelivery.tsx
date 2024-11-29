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
import { useRouter } from "expo-router";

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
  const [customPrice, setCustomPrice] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const session = useSession();
  const router = useRouter();

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
            itemdescription: selectedListing.itemdescription
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

 const handleChatWithSender = async () => {
  try {
    if (!selectedListing?.listingid || !session?.user?.id) {
      console.error("Missing listing ID or user ID");
      return;
    }

    // Create or get order first
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          delivererid: session.user.id,
          listingid: selectedListing.listingid,
          status: "ACCEPTED",
          itemdescription: selectedListing.itemdescription
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return;
    }

    setRenderAcceptDelivery(false);
    await router.push({
      pathname: "/chatscreen",
      params: {
        orderId: orderData.orderid,
        senderId: selectedListing.senderid,
      },
    });
  } catch (error) {
    console.error("Error in chat handler:", error);
  }
};

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
              source={diningTableImage} //using the imported image here
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

        <View style={styles.buttonContainer}>
          <View style={styles.views}>
            <AntDesign name="eyeo" size={20} color="black" />
            <Text style={fontStyles.text}>{selectedListing?.views}</Text>
          </View>

          <TouchableOpacity
            style={buttonStyles.chatButton}
            onPress={handleChatWithSender}
          >
            <AntDesign
              name="message1"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={buttonStyles.buttonText}>Chat With Sender</Text>
          </TouchableOpacity>
        </View>

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
    marginTop: 10,
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
  },
  inputWithIcon: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "black",
  },
});

export default AcceptDelivery;