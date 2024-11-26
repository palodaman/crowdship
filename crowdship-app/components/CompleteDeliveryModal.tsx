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
import fontStyles from "../styles/fontStyles";
import buttonStyles from "../styles/buttonStyles";
import { AntDesign } from "@expo/vector-icons";

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
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllOrders: () => void;
}

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
  uploadedContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    // position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: "117%",
    height: "127%",
    borderRadius: 10,
  },
});

const CompleteDeliveryModal: React.FC<CompleteDeliveryModalProps> = ({
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
        "Please upload a picture of the item or confirm in-person delivery."
      );
      return;
    } else {
      try {
        const { error: orderError } = await supabase
          .from("orders")
          .update({ status: "COMPLETE" })
          .eq("listingid", selectedListing.listingid);
  
        if (orderError) throw orderError;
  
        const { error: listingError } = await supabase
          .from("listings")
          .update({ status: "INACTIVE" })
          .eq("listingid", selectedListing.listingid);
  
        if (listingError) throw listingError;
  
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
      <ScrollView persistentScrollbar={true}>
        <View style={styles.textContainer}>
          <Text style={fontStyles.title}>Delivery Confirmation</Text>
          <Text style={fontStyles.text}>
            Please confirm the delivery of {selectedListing.itemdescription}.
            Depending on the delivery method, please follow the instructions
            below.
          </Text>
          <Text style={[fontStyles.h1, { marginTop: 20 }]}>
            No Contact Delivery
          </Text>

          <View
            style={[
              styles.uploadContainer,
              itemImageUrl && styles.uploadedContainer, // Add success styling if an image is uploaded
            ]}
          >
            <View style={styles.imageContainer}>
              {itemImageUrl ? (
                <Image
                  source={{ uri: itemImageUrl }}
                  style={styles.itemImage}
                />
              ) : (
                <AntDesign name="upload" size={24} color="#7D8CA0" /> // Bigger icon for visibility
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[buttonStyles.secondaryButton]}
            onPress={pickImage}
          >
            <Text style={buttonStyles.buttonText}>Upload Item Image</Text>
          </TouchableOpacity>
          <Text style={[fontStyles.h1, { marginTop: 20 }]}>
            In Person Delivery
          </Text>
          <CheckBox
            title="I confirm that the item was delivered in person."
            checked={check}
            onPress={handleCheck}
            checkedColor="#47BF7E"
          />

          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={() => {
              handleCompleteDelivery();
            }}
          >
            <Text style={buttonStyles.buttonText}>Complete Delivery</Text>
          </TouchableOpacity>

          {message && <Text style={fontStyles.redText}>{message}</Text>}

          <TouchableOpacity
            style={buttonStyles.tertiaryButton}
            onPress={() => {
              setRenderModal(false);
            }}
          >
            <Text style={buttonStyles.tertiaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompleteDeliveryModal;
