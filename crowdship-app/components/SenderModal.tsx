import { router } from "expo-router";
import { useState } from "react";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import diningTableImage from "../assets/diningTable.png";
import EditDeliveryModal from "./EditDeliveryModal";
import buttonStyles from "../styles/buttonStyles";
import { AntDesign, Feather } from "@expo/vector-icons";
import fontStyles from "../styles/fontStyles";
import StepIndicator from "react-native-step-indicator";
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
  notes: string | null;
  pickupdatetime: string;
}

interface SenderModalProps {
  selectedListing: Listing;
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
  transactionComplete: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SenderModal: React.FC<SenderModalProps> = ({
  selectedListing,
  setRenderModal,
  transactionComplete,
  setEditMode,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [renderEditDelivery, setRenderEditDelivery] = useState<boolean>(false);
  const labels = ["Picked Up", "In Transit", "Delivered"];
  const [currentPosition, setCurrentPosition] = useState(-1); // -1 to start at 0, 0 to start at 1, etc.
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#47BF7E",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "#47BF7E",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#47BF7E",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#47BF7E",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "#47BF7E",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#fe7013",
  };

  const handleEditDelivery = () => {
    setRenderEditDelivery(true);
  };

  console.log("renderEditDelivery", renderEditDelivery);
  console.log("transactionComplete", transactionComplete);
  function utcToZonedTime(arg0: Date, arg1: string): string | number | Date {
    throw new Error("Function not implemented.");
  }

  return (
    <View style={styles.container}>
      <ScrollView persistentScrollbar={true}>
        {renderEditDelivery === false ? (
          <View style={styles.textContainer}>
            <Text style={fontStyles.title}>Shipment Information</Text>
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

            <View style={{ width: "90%", alignSelf: "center" }}>
              <StepIndicator
                customStyles={customStyles}
                currentPosition={currentPosition}
                labels={labels}
                stepCount={3}
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
              <Feather name="dollar-sign" size={20} color="black" />
              <View style={styles.cardContent}>
                <Text style={fontStyles.boldedText}>Price</Text>
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

            {/* Chat Button */}
            {(transactionComplete === "claimed" ||
              transactionComplete === "inactive") && (
              <TouchableOpacity
                style={buttonStyles.chatButton}
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
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <Text style={buttonStyles.buttonText}>Chat With Driver</Text>
              </TouchableOpacity>
            )}

            {/* if the transaction is not complete, show the edit delivery button */}
            {transactionComplete === "active" && (
              <TouchableOpacity
                style={buttonStyles.primaryButton}
                onPress={handleEditDelivery}
              >
                <Text style={buttonStyles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <EditDeliveryModal
            setEditMode={setEditMode}
            selectedListing={selectedListing}
            setRenderModal={setRenderModal}
            setRenderEditDelivery={setRenderEditDelivery}
            fetchAllShipments={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
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

export default SenderModal;

/*This code was developed with the assistance of ChatGPT and Copilot*/
