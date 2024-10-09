import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DeliveryRequest() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [itemName, setItemName] = useState('');

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
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.itemImage} />
        ) : (
          <Text>No item picture selected</Text>
        )}

        <Button title="Upload/Take Item Picture" onPress={pickImage} />

        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
        />

        {itemName ? <Text style={styles.itemName}>Item: {itemName}</Text> : null}
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
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    marginTop: 10,
  },
});
