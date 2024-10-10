import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DeliveryRequest() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropOffAddress, setDropOffAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState(''); // New state for price

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Request Delivery Header */}
      <Text style={styles.header}>Request Delivery</Text>

      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.itemImage} />
      ) : (
        <Text>No item picture selected</Text>
      )}

      <Button title="Upload/Take Item Picture" onPress={pickImage} />

      {/* Item Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={itemName}
        onChangeText={setItemName}
      />

      {/* Pickup Address Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter pickup address"
        value={pickupAddress}
        onChangeText={setPickupAddress}
      />

      {/* Drop Off Address Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter drop-off address"
        value={dropOffAddress}
        onChangeText={setDropOffAddress}
      />

      {/* Notes Input */}
      <TextInput
        style={styles.notesInput}
        placeholder="Add notes (instructions or extra info)"
        value={notes}
        onChangeText={setNotes}
        multiline  // Allows multi-line input for notes
        numberOfLines={4}  // Number of lines for the notes input
      />

      {/* Price Input */}
      <TextInput
        style={styles.input}
        placeholder="$: Set price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric" // Ensure the keyboard is optimized for entering numbers
      />

      <Button title="Submit Delivery Request" onPress={() => { /* handle submission */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes the full height of the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    padding: 20, // Adds some padding around the elements
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Space between the header and the rest of the form
  },
  itemImage: {
    width: 200,
    height: 200,
    marginBottom: 20, // Adds space below the image
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    width: '80%',   // Takes 80% of the width of the screen for the input field
    borderRadius: 100,
  },
  notesInput: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    width: '80%',
    height: 60,  // Sets the height for multi-line input
    borderRadius: 20,
    textAlignVertical: 'top',  // Ensures text starts at the top for multi-line input
  },
});
