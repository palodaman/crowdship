import { useState } from "react";
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
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";

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
}

interface EditDeliveryModalProps {
  selectedListing: Listing;
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderEditDelivery: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllShipments: () => void;
}

const EditDeliveryModal: React.FC<EditDeliveryModalProps> = ({
  selectedListing,
  setRenderModal,
  setRenderEditDelivery,
  fetchAllShipments,
}) => {
  const [loading, setLoading] = useState(true);
  const [itemDescription, setItemDescription] = useState(
    selectedListing.itemdescription
  );
  const [startingAddress, setStartingAddress] = useState(
    selectedListing.startingaddress
  );
  const [destinationAddress, setDestinationAddress] = useState(
    selectedListing.destinationaddress
  );
  const [notes, setNotes] = useState(selectedListing.notes || "");
  const [price, setPrice] = useState(selectedListing.price.toString());
  const [itemImageUrl, setItemImageUrl] = useState(
    selectedListing.itemimageurl
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(0);
  const [deleteMessage, setDeleteMessage] = useState("");

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

  const handleDelete = async () => {
    setConfirmDelete(confirmDelete + 1);
    console.log("confirmDelete", confirmDelete);
    if (confirmDelete === 0) {
      setDeleteMessage("Press delete again to confirm");
      return;
    } else if (confirmDelete === 1) {
      try {
        const { data, error } = await supabase
          .from("listings")
          .delete()
          .eq("listingid", selectedListing.listingid);

        // setMessage("Listing was successfully deleted!");
        setRenderModal(false);
        setRenderEditDelivery(false);
        fetchAllShipments();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
        
      if (userError) throw userError;

      console.log("item description", itemDescription);
      const { data, error } = await supabase
        .from("listings")
        .update({
          itemdescription: itemDescription,
          startingaddress: startingAddress,
          destinationaddress: destinationAddress,
          notes: notes,
          itemimageurl: itemImageUrl,
          price: parseFloat(price),
        })
        .eq("listingid", selectedListing.listingid);

      setMessage("Edits were successfully saved!");
      // setRenderModal(false);
      // setRenderEditDelivery(false);
      // fetchAllShipments();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#d3d3d3" />
    </View>;
  }

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.textContainer}>
        {/* Upload Button or Image */}
        {message !== "" && <Text style={styles.message}>{message}</Text>}
        <View
          style={[
            styles.uploadContainer,
            itemImageUrl && styles.uploadedContainer,
          ]}
        >
          {itemImageUrl ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: itemImageUrl }} style={styles.itemImage} />
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
              <Text style={styles.uploadButtonText}>Upload New Picture</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Input Fields as Cards */}
        <View style={styles.card}>
          <FontAwesome6 name="edit" size={24} color="black" />
          <TextInput
            style={styles.inputWithIcon}
            placeholder={selectedListing.itemdescription}
            value={itemDescription}
            onChangeText={setItemDescription}
          />
        </View>

        <View style={styles.card}>
          <FontAwesome6 name="location-arrow" size={24} color="black" />
          <TextInput
            style={styles.inputWithIcon}
            placeholder={selectedListing.startingaddress}
            value={startingAddress}
            onChangeText={setStartingAddress}
          />
        </View>

        <View style={styles.card}>
          <Entypo name="location-pin" size={24} color="black" />
          <TextInput
            style={styles.inputWithIcon}
            placeholder={selectedListing.destinationaddress}
            value={destinationAddress}
            onChangeText={setDestinationAddress}
          />
        </View>

        <View style={styles.card}>
          <Foundation name="info" size={24} color="black" />
          <TextInput
            style={styles.inputWithIcon}
            placeholder={selectedListing.notes || "Add note"}
            value={notes}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={2}
          />
        </View>

        <View style={styles.card}>
          <Foundation name="dollar" size={24} color="black" />
          <TextInput
            style={styles.inputWithIcon}
            placeholder={selectedListing.price.toString()}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        {deleteMessage !== "" && (
          <Text style={styles.deleteMessage}>{deleteMessage}</Text>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleDelete}>
          <Text style={styles.submitButtonText}>Delete Listing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            setRenderModal(false);
            setRenderEditDelivery(false);
          }}
        >
          <Text style={styles.submitButtonText}>Cancel</Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator size="large" color="#d3d3d3" />}
      </View>
    </ScrollView>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardData: {
    fontSize: 16,
    color: "#666",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
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
  message: {
    top: 10,
    marginBottom: 10,
    width: "100%",
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  reuploadButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
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
  inputWithIcon: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "black",
  },
  deleteMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default EditDeliveryModal;
