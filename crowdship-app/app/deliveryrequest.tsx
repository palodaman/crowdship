import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";
import buttonStyles from "../styles/buttonStyles";

// Your Google API Key
const GOOGLE_API_KEY = "AIzaSyCIUk8AvslqD49GmsyLs19xaxvREx1R9PE";

export default function DeliveryRequest() {
  const [itemDescription, setItemDescription] = useState("");
  const [startingAddress, setStartingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [startingAddressError, setStartingAddressError] = useState("");
  const [destinationAddressError, setDestinationAddressError] = useState("");
  const [notes, setNotes] = useState("");
  const [price, setPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const session = useSession();
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  // Function to validate address using Google Geocoding API
  const validateAddress = async (address, setErrorCallback) => {
    if (!address) {
      setErrorCallback(""); // Clear the error if the field is empty
      return false;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const { data } = response;

      if (data.status === "OK" && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        // Check if the country is Canada
        const country = addressComponents.find((component) =>
          component.types.includes("country")
        );

        if (country && country.long_name === "Canada") {
          setErrorCallback(""); // Clear the error if the address is valid
          return true;
        } else {
          setErrorCallback("Address must be in Canada.");
          return false;
        }
      } else {
        setErrorCallback("Invalid Address");
        return false;
      }
    } catch (error) {
      console.error("Error validating address:", error);
      setErrorCallback("Unable to validate address. Please try again.");
      return false;
    }
  };

  const calculatePrice = async () => {
    try {
      // Fetch distance from Google Distance Matrix API
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            origins: startingAddress,
            destinations: destinationAddress,
            key: GOOGLE_API_KEY,
          },
        }
      );
  
      const { data } = response;
  
      if (data.status === "OK" && data.rows.length > 0) {
        const elements = data.rows[0].elements;
        if (elements.length > 0 && elements[0].status === "OK") {
          const distanceInMeters = elements[0].distance.value;
          const distanceInKm = distanceInMeters / 1000;
  
          // Convert dimensions from feet to inches
          const lengthInInches = length * 12;
          const widthInInches = width * 12;
          const heightInInches = height * 12;
  
          // Calculate volume in cubic inches
          const volume = lengthInInches * widthInInches * heightInInches;
  
          // Pricing Algorithm
          let volumePrice = 0;
          if (volume < 10000) volumePrice = 2;
          else if (volume < 30000) volumePrice = 5;
          else if (volume < 50000) volumePrice = 10;
          else volumePrice = 20 + 10; // $20 base + $10 oversize surcharge for volume >= 50,000
  
          const baseFee = 5;
  
          // Calculate distance-based fee
          let distanceFee = 0;
          if (distanceInKm <= 20) {
            distanceFee = distanceInKm * 0.15; // $0.15 per km for distance <= 20km
          } else {
            distanceFee = distanceInKm * 0.20; // $0.20 per km for distance > 20km
          }
  
          // Calculate the estimated price
          const estimatedPrice = baseFee + volumePrice + distanceFee;
  
          setPrice(estimatedPrice.toFixed(2).toString()); // Set the price with two decimal places
          setIsModalVisible(false); // Close the modal
        } else {
          Alert.alert("Error", "Unable to calculate distance between addresses.");
        }
      } else {
        Alert.alert("Error", "Invalid address information. Please check and try again.");
      }
    } catch (error) {
      console.error("Error calculating price:", error);
      Alert.alert("Error", "Failed to calculate the delivery price. Please try again.");
    }
  };
  
  

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");

    // If any address errors are present, stop the submission
    if (startingAddressError || destinationAddressError) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        "Please correct the address errors before submitting."
      );
      return;
    }

    try {
      // Proceed to save data to Supabase if addresses are valid
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase.from("listings").insert([
        {
          senderid: session?.user.id,
          status: "ACTIVE",
          price: parseFloat(price),
          startingaddress: startingAddress,
          destinationaddress: destinationAddress,
          itemdescription: itemDescription,
          itemimageurl: itemImageUrl,
          notes: notes,
          views: 0,
        },
      ]);

      if (error) throw error;

      setMessage("Delivery request submitted successfully!");
      // Reset form fields
      setItemDescription("");
      setStartingAddress("");
      setDestinationAddress("");
      setPrice("");
      setNotes("");
      setItemImageUrl(null);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      bounces={false}
      persistentScrollbar={true}
    >
      <View style={styles.textContainer}>
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
              placeholder="Enter item description"
              value={itemDescription}
              onChangeText={setItemDescription}
            />
          </View>

          <View style={styles.card}>
            <AntDesign name="enviroment" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter starting address"
              value={startingAddress}
              onChangeText={setStartingAddress}
              onBlur={() => {
                if (startingAddress.trim() !== "") {
                  validateAddress(startingAddress, setStartingAddressError);
                } else {
                  setStartingAddressError("");
                }
              }}
            />
          </View>
          {startingAddressError ? (
            <Text style={styles.errorText}>{startingAddressError}</Text>
          ) : null}

          <View style={styles.card}>
            <AntDesign name="enviromento" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter destination address"
              value={destinationAddress}
              onChangeText={setDestinationAddress}
              onBlur={() => {
                if (destinationAddress.trim() !== "") {
                  validateAddress(destinationAddress, setDestinationAddressError);
                } else {
                  setDestinationAddressError("");
                }
              }}
            />
          </View>
          {destinationAddressError ? (
            <Text style={styles.errorText}>{destinationAddressError}</Text>
          ) : null}

          <View style={styles.card}>
            <Feather name="dollar-sign" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Set a price for the delivery"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            {/* Tooltip Icon */}
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={{ marginLeft: 10 }} // Style for spacing
            >
              <MaterialIcons name="info-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <AntDesign name="infocirlceo" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Add notes (instructions or extra info)"
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={2}
            />
          </View>
        </View>
        <TouchableOpacity
          style={buttonStyles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={buttonStyles.buttonText}>Submit Delivery Request</Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator size="large" color="#d3d3d3" />}
        {message !== "" && <Text style={styles.message}>{message}</Text>}
      </View>

      {/* Modal for Weight and Dimensions Input */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Estimate Delivery Price</Text>

            {/* Add a subtitle or instruction for better user understanding */}
            <Text style={styles.modalSubtitle}>
              Enter the dimensions and weight of your package to estimate the delivery price.
            </Text>

            <View style={styles.dimensionsInputContainer}>
              <View style={styles.dimensionInputWrapper}>
                <Text>L:</Text>
                <TextInput
                  style={styles.dimensionInput}
                  placeholder="Length (ft)"
                  value={length}
                  onChangeText={setLength}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dimensionInputWrapper}>
                <Text>W:</Text>
                <TextInput
                  style={styles.dimensionInput}
                  placeholder="Width (ft)"
                  value={width}
                  onChangeText={setWidth}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dimensionInputWrapper}>
                <Text>H:</Text>
                <TextInput
                  style={styles.dimensionInput}
                  placeholder="Height (ft)"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.modalTitle}>Enter Package Weight</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={calculatePrice}
            >
              <Text style={buttonStyles.buttonText}>Calculate Estimated Price</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyles.secondaryButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={buttonStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  dimensionsInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dimensionInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  dimensionInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    fontSize: 16,
    width: 60,
    marginLeft: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 100,
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
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
    padding: 0,
    justifyContent: "center",
    height: 175,
    borderWidth: 0,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
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
  inputWithIcon: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "black",
  },
  errorText: {
    color: "red",
    marginLeft: 25,
    marginTop: -10,
    marginBottom: 10,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "#47BF7E",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },  
});
