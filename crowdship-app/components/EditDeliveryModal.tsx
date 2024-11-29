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
import { AntDesign, Feather } from "@expo/vector-icons";
import buttonStyles from "../styles/buttonStyles";
import fontStyles from "../styles/fontStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

interface EditDeliveryModalProps {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedListing: Listing;
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderEditDelivery: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllShipments: () => void;
}

const EditDeliveryModal: React.FC<EditDeliveryModalProps> = ({
  setEditMode,
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
  const [pickupDateTime, setPickupDateTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
          pickupdatetime: pickupDateTime ? pickupDateTime.toISOString() : null,
        })
        .eq("listingid", selectedListing.listingid);

      setMessage("Edits were successfully saved!");
      setEditMode(true);
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

  const showDateTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setPickupDateTime(date);
    hideDateTimePicker();
  };

  if (loading) {
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#d3d3d3" />
    </View>;
  }

  return (
    <ScrollView bounces={false} persistentScrollbar={true}>
      <View style={styles.textContainer}>
        <Text style={fontStyles.title}>Edit Delivery</Text>
        {/* Upload Button or Image */}
        <View
          style={[
            styles.uploadContainer,
            itemImageUrl && styles.uploadedContainer,
          ]}
        >
          <View style={styles.imageContainer}>
            {itemImageUrl ? (
              <Image source={{ uri: itemImageUrl }} style={styles.itemImage} />
            ) : (
              <AntDesign name="upload" size={24} color="black" />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={buttonStyles.secondaryButton}
          onPress={pickImage}
        >
          <Text style={buttonStyles.buttonText}>Upload Item Image</Text>
        </TouchableOpacity>

        {/* Input Fields as Cards */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.card}>
            <AntDesign name="edit" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder={selectedListing.itemdescription}
              value={itemDescription}
              onChangeText={setItemDescription}
            />
          </View>

          <View style={styles.card}>
            <AntDesign name="enviroment" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder={selectedListing.startingaddress}
              value={startingAddress}
              onChangeText={setStartingAddress}
            />
          </View>

          <View style={styles.card}>
            <AntDesign name="enviromento" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder={selectedListing.destinationaddress}
              value={destinationAddress}
              onChangeText={setDestinationAddress}
            />
          </View>

          <View style={styles.card}>
            <AntDesign name="infocirlceo" size={24} color="black" />
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
            <Feather name="dollar-sign" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder={selectedListing.price.toString()}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.card}>
            <AntDesign name="calendar" size={24} color="black" />
            <TouchableOpacity
              style={[styles.inputWithIcon, styles.dateTimeButton]}
              onPress={showDateTimePicker}
            >
              <Text style={styles.dateTimeText}>
                {pickupDateTime
                  ? pickupDateTime.toLocaleString()
                  : "Set a pickup date & time"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* DateTimePicker Modal */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDateTimePicker}
          />
        </View>
        {deleteMessage !== "" && (
          <Text style={fontStyles.redText}>{deleteMessage}</Text>
        )}

        {message !== "" && <Text style={fontStyles.greenText}>{message}</Text>}

        <TouchableOpacity
          style={buttonStyles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={buttonStyles.buttonText}>Submit Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={buttonStyles.secondaryButton}
          onPress={handleDelete}
        >
          <Text style={buttonStyles.buttonText}>Delete Listing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={buttonStyles.tertiaryButton}
          onPress={() => {
            setRenderModal(false);
            setRenderEditDelivery(false);
          }}
        >
          <Text style={buttonStyles.tertiaryButtonText}>Cancel</Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator size="large" color="#d3d3d3" />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  uploadContainer: {
    width: "75%",
    height: 150,
    backgroundColor: "#7F8A9480",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#07181D",
  },
  imageContainer: {
    width: "100%",
    height: "110%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  itemImage: {
    width: "120%",
    height: "120%",
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
  inputWithIcon: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "black",
  },
  dateTimeButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#444",
  },
});

export default EditDeliveryModal;
