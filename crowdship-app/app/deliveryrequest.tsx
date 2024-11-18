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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";
import buttonStyles from "../styles/buttonStyles";

export default function DeliveryRequest() {
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
          <Text style={buttonStyles.buttonText}>Upload Image</Text>
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
            />
          </View>

          <View style={styles.card}>
            <AntDesign name="enviromento" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter destination address"
              value={destinationAddress}
              onChangeText={setDestinationAddress}
            />
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

          <View style={styles.card}>
            <Feather name="dollar-sign" size={24} color="black" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Set a price for the delivery"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    padding: 0, //ensures padding remains consistent after upload
    justifyContent: "center", //aligns the image in the center
    height: 175, //adjusts height to fit the image better
    borderWidth: 0, //removes the border once the image is uploaded
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
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "#5DE49B",
    textAlign: "center",
  },
});
