import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button, TextInput, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Foundation from "@expo/vector-icons/Foundation";
import { supabase } from '../lib/supabase'; // Make sure to create this file with Supabase client initialization
import { useSession } from "../hooks/useSession";

export default function DeliveryRequest() {
  const [itemDescription, setItemDescription] = useState("");
  const [startingAddress, setStartingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [price, setPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const session  = useSession();
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
      aspect: [1, 1], // square aspect ratio
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
          // listedat and updatedat will be handled by Supabase
          views: 0, // Initialize views to 0
        },
      ]);

      if (error) throw error;

      setMessage("Delivery request submitted successfully!");
      // Reset form fields
      setItemDescription("");
      setStartingAddress("");
      setDestinationAddress("");
      setPrice("");
      setItemImageUrl(null);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Request Delivery Header */}
      <Text style={styles.header}>Request Delivery</Text>

      {itemImageUrl ? (
        <Image source={{ uri: itemImageUrl }} style={styles.itemImage} />
      ) : (
        <Text>No item picture selected</Text>
      )}

      <Button title="Upload Item Picture" onPress={pickImage} />

      {/* Item Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter item description"
        value={itemDescription}
        onChangeText={setItemDescription}
      />

      {/* Pickup Address Input */}
      <View style={styles.inputRow}>
        <FontAwesome6 name="location-arrow" size={24} color="black" />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Enter starting address"
          value={startingAddress}
          onChangeText={setStartingAddress}
        />
      </View>

      {/* Drop Off Address Input */}
      <View style={styles.inputRow}>
        <Entypo name="location-pin" size={24} color="black" />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Enter destination address"
          value={destinationAddress}
          onChangeText={setDestinationAddress}
        />
      </View>

      {/* Price Input */}
      <View style={styles.inputRow}>
        <Foundation name="dollar" size={24} color="black" />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Set price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric" // Ensure the keyboard is optimized for entering numbers
        />
      </View>

      <Button
        title="Submit Delivery Request"
        onPress={handleSubmit}
        disabled={isLoading}
      />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {message !== "" && <Text style={styles.message}>{message}</Text>}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes the full height of the screen
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    padding: 20, // Adds some padding around the elements
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // Space between the header and the rest of the form
  },
  itemImage: {
    width: 200,
    height: 200,
    marginBottom: 20, // Adds space below the image
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    width: "80%", // Takes 80% of the width of the screen for the input field
    borderRadius: 100,
  },
  inputRow: {
    flexDirection: "row", // Align the icon and input in a row
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 100,
    width: "80%",
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    height: 40,
  },
  inputWithIcon: {
    flex: 1, // Let the input take the rest of the space
    paddingHorizontal: 10,
  },
  notesInput: {
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    width: "80%",
    height: 60, // Sets the height for multi-line input
    borderRadius: 20,
    textAlignVertical: "top", // Ensures text starts at the top for multi-line input
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});
