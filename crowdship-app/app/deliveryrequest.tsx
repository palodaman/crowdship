import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [itemName, setItemName] = useState('');

  const pickImage = async () => {
    // Ask the user for permission to access media library
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CrowdShip</Text>
      </View>

      <View style={styles.container}>
        {/* Display the selected image or a default placeholder */}
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.profileImage} />
        ) : (
          <Text>No profile picture selected</Text>
        )}

        <Button title="Select Profile Picture" onPress={pickImage} />

        {/* TextInput for the item name */}
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
        />

        {/* Display the entered item name */}
        {itemName ? <Text style={styles.itemName}>Item: {itemName}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    height: 50, // Increased height
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    marginBottom: 20,  // Adjust spacing
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    width: '80%',   // Width of the TextInput
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    marginTop: 10,
  },
});
