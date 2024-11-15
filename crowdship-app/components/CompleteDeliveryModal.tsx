import { router } from "expo-router";
import { useRef, useState } from "react";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; //import your local image from the assets folder
import { supabase } from "../lib/supabase";
import { CheckBox } from "@rneui/themed";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

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
});

const CompconsteDeliveryModal: React.FC<CompconsteDeliveryModalProps> = ({
  selectedListing,
  setRenderModal,
  fetchAllOrders,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [check, setCheck] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | undefined
  >(undefined);
  const [photo, setPhoto] = useState<{ uri: string } | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);

  const handleUploadImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the image upload logic here
      // After successful upload, set imageUploaded to true
      setImageUploaded(true);
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      console.log("Compconste delivery");
      //   const { error } = await supabase
      //     .from("orders")
      //     .update({ status: "COMPconstE" })
      //     .eq("listingid", selectedListing.listingid);

      //   if (error) throw error;

      //   fetchAllOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheck = () => {
    if (check) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  };

  if (loading) {
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#d3d3d3" />
    </View>;
  }

  console.log("photo", photo);
  console.log("check", check);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Delivery Confirmation</Text>
          <Text style={styles.cardTitle}>
            Please confirm the delivery of {selectedListing.itemdescription}.
            You can either upload a photo for verification or confirm the
            delivery in person.
          </Text>
          <Text style={styles.h1}>No contact delivery</Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              handleUploadImage();
            }}
          >
            <Text style={styles.submitButtonText}>Upload Image</Text>
          </TouchableOpacity>
          <Text style={styles.h1}>In person delivery</Text>
          <CheckBox
            title="I confirm that the item was delivered in person."
            checked={check}
            onPress={handleCheck}
          />

          <TouchableOpacity
            style={styles.chatButton}
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
            <Icon
              name="comment"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Chat With Sender</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              setRenderModal(false);
            }}
          >
            <Text style={styles.submitButtonText}>Complete Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            disabled={!check || !photo}
            onPress={() => {
              handleCompleteDelivery();
            }}
          >
            <Text style={styles.submitButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   textContainer: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//   },
//   h1: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginVertical: 10,
//     marginTop: 20,
//   },
//   uploadContainer: {
//     width: "75%",
//     height: 175,
//     backgroundColor: "#dde8ff",
//     borderRadius: 10,
//     padding: 15,
//     marginVertical: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     borderStyle: "dashed",
//     borderWidth: 2,
//     borderColor: "#4a90e2",
//   },
//   uploadedContainer: {
//     backgroundColor: "transparent",
//     borderWidth: 1,
//   },
//   itemImage: {
//     width: "125%",
//     height: "125%",
//     borderRadius: 10,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginVertical: 10,
//     width: "90%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardContent: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   cardData: {
//     fontSize: 16,
//     color: "#666",
//   },
//   chatButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#4a90e2",
//     padding: 15,
//     borderRadius: 10,
//     width: "90%",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   buttonIcon: {
//     marginRight: 10,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 20,
//     marginBottom: "10%",
//   },
//   button: {
//     width: "40%",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 5,
//     marginHorizontal: 5,
//     shadowColor: "black",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//   },
//   submitButton: {
//     marginTop: 20,
//     backgroundColor: "#4a90e2",
//     padding: 15,
//     borderRadius: 10,
//     width: "90%",
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
// });

export default CompconsteDeliveryModal;
