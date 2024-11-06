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
import Icon from "react-native-vector-icons/FontAwesome"; //import your local image from the assets folder
import diningTableImage from "../assets/diningTable.png";
import { useSession } from "../hooks/useSession";
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
}

const EditDeliveryModal: React.FC<EditDeliveryModalProps> = ({
  selectedListing,
  setRenderModal,
  setRenderEditDelivery,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState("");
  const [startingAddress, setStartingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [price, setPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const session = useSession();

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

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("listings")
        .update({
          itemdescription: itemDescription,
          startingaddress: startingAddress,
          destinationaddress: destinationAddress,
          notes: notes,
          itemImageUrl: itemImageUrl,
          price: parseFloat(price),
        })
        .eq("listingid", selectedListing.listingid);


      if (error) throw error;

      setMessage("Delivery request submitted successfully!");
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
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.textContainer}>
        {/* Upload Button or Image */}
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Edits</Text>
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
        {message !== "" && <Text style={styles.message}>{message}</Text>}
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

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadedContainer: {
    padding: 0, //ensures padding remains consistent after upload
    justifyContent: "center", //aligns the image in the center
    height: 175, //adjusts height to fit the image better
    borderWidth: 0, //removes the border once the image is uploaded
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
  inputWithIcon: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "black",
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
    marginTop: 20,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});

export default EditDeliveryModal;
