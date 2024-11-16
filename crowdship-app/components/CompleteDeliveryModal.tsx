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
import { supabase } from "../lib/supabase";
import { CheckBox } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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

interface CompconsteDeliveryModalProps {
  selectedListing: Listing;
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllOrders: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  textContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  h1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    marginTop: 20,
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
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
  submitButton: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center", // Centers the image vertically
    alignItems: "center", // Centers the image horizontally
  },
  uploadButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  reuploadButton: {
    position: "absolute",
    backgroundColor: "#4a90e2",
    padding: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  reuploadButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 12,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});

const CompconsteDeliveryModal: React.FC<CompconsteDeliveryModalProps> = ({
  selectedListing,
  setRenderModal,
  fetchAllOrders,
}) => {
  const [check, setCheck] = useState<boolean>(false);
  const [itemImageUrl, setItemImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], //square aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setItemImageUrl(result.assets[0].uri);
    }
  };

  const handleCompleteDelivery = async () => {
    if (!check && !itemImageUrl) {
      setMessage(
        "Please upload a picture of the item or confirm in person delivery."
      );
      return;
    } else {
      try {
        const { error } = await supabase
          .from("orders")
          .update({ status: "COMPLETE" })
          .eq("listingid", selectedListing.listingid);
      } catch (error) {
        console.error(error);
      } finally {
        setRenderModal(false);
        fetchAllOrders();
      }
    }
  };

  const handleCheck = () => {
    if (check) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Delivery Confirmation</Text>
          <Text style={styles.text}>
            Please confirm the delivery of {selectedListing.itemdescription}.
            Depending on the delivery method, please follow the instructions
            below.
          </Text>
          <Text style={styles.h1}>No Contact Delivery</Text>

          <View
            style={[
              styles.uploadContainer,
              itemImageUrl && styles.uploadedContainer,
            ]}
          >
            {itemImageUrl ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: itemImageUrl }}
                  style={styles.itemImage}
                />
                <TouchableOpacity
                  style={styles.reuploadButton}
                  onPress={pickImage}
                >
                  <FontAwesome6 name="camera" size={18} color="white" />
                  <Text style={styles.reuploadButtonText}>Re-upload</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Upload Item Picture</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.h1}>In Person Delivery</Text>
          <CheckBox
            title="I confirm that the item was delivered in person."
            checked={check}
            onPress={handleCheck}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              handleCompleteDelivery();
            }}
          >
            <Text style={styles.submitButtonText}>Complete Delivery</Text>
          </TouchableOpacity>

          {message && <Text style={styles.errorMessage}>{message}</Text>}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              setRenderModal(false);
            }}
          >
            <Text style={styles.submitButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompconsteDeliveryModal;
