import { router } from "expo-router";
import { useState } from "react";
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
import diningTableImage from "../assets/diningTable.png";
import buttonStyles from "../styles/buttonStyles";
import { AntDesign, Feather } from "@expo/vector-icons";
import fontStyles from "../styles/fontStyles";
import { addHours, format, parseISO } from "date-fns";

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

interface DefaultDeliveryModalProps {
  selectedListing: Listing;
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DefaultDeliveryModal: React.FC<DefaultDeliveryModalProps> = ({
  selectedListing,
  setRenderModal,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleStartDelivery = () => {
    setMessage("Sucessfully started delivery!");
    setTimeout(() => {
      setLoading(false);
      setMessage(null);
    }, 3000);
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
          <Text style={fontStyles.title}>Delivery Information</Text>
          {/* Display the local image */}
          <View
            style={[
              styles.uploadContainer,
              selectedImage && styles.uploadedContainer,
            ]}
          >
            <Image
              source={diningTableImage}
              style={styles.itemImage}
              resizeMode="cover"
            />
          </View>

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
                {selectedListing.price || "Not available"}
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

          {selectedListing.status === "CLAIMED" && (
            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={handleStartDelivery}
            >
              <Text style={buttonStyles.buttonText}>Start Delivery</Text>
            </TouchableOpacity>
          )}

          {message && (
            <Text style={[fontStyles.greenText, { marginTop: 10 }]}>
              {message}
            </Text>
          )}

          <TouchableOpacity
            style={[buttonStyles.chatButton, { backgroundColor: "#07181D" }]}
            onPress={() => {
              if (selectedListing?.listingid && selectedListing?.senderid) {
                setRenderModal(false); //close the modal
                router.push({
                  pathname: "/chatscreen",
                  params: {
                    orderId: selectedListing.listingid,
                    senderId: selectedListing.senderid,
                  },
                });
              }
            }}
          >
            <AntDesign
              name="message1"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={buttonStyles.buttonText}>Chat With Sender</Text>
          </TouchableOpacity>
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
  },
  cardContent: {
    marginLeft: 15,
    flex: 1,
  },
});

export default DefaultDeliveryModal;

/*This code was developed with the assistance of ChatGPT and Copilot*/
