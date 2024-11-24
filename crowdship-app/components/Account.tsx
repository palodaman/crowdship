import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import buttonStyles from "../styles/buttonStyles";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("userid", session?.user.id);

      if (data?.[0]) {
        setAvatarUrl(data?.[0].avatar_url); // Set the avatar URL from the profile data
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUsername = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data: userData } = await supabase
        .from("profiles")
        .select("username")
        .eq("userid", session?.user.id);

      if (userData?.[0]) {
        setUsername(userData?.[0].username);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getProfile();
      getUsername();
    }
  }, [session]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        userid: session?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      await getProfile();

      Alert.alert("Profile updated!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Upload image to Supabase Storage using FormData
  const uploadImageToSupabase = async (uri: string) => {
    try {
      const fileName = `${session.user.id}-${Date.now()}`; // Create a unique file name using the user ID and current timestamp

      const { error: uploadError } = await supabase.storage
        .from("avatars") // Upload directly to the 'avatars' bucket
        .upload(fileName, {
          uri,
          type: "image/jpeg",
          name: fileName,
        });

      if (uploadError) {
        throw uploadError;
      }
      await getProfile();

      // Get the public URL of the uploaded file
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      if (!data?.publicUrl) throw new Error("Could not get public URL.");

      return data.publicUrl;
    } catch (error) {
      Alert.alert("Error uploading image:", error.message);
      return null;
    }
  };

  // Function to handle the image picking and upload
  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;
      // Upload to Supabase storage and get the public URL
      const uploadedUrl = await uploadImageToSupabase(pickedUri);

      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl); // Update the avatar URL state
        // Update the profile with the new avatar URL
        await updateProfile({ username, avatar_url: uploadedUrl });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {/* Render image if avatarUrl exists, otherwise display placeholder */}
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Always show upload button */}
        <TouchableOpacity
          style={buttonStyles.secondaryButton}
          onPress={pickImage}
        >
          <Text style={buttonStyles.buttonText}>Upload Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>

      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
            disabled={loading}
          >
            <Text style={buttonStyles.buttonText}>
              {loading ? "Loading ..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={() => supabase.auth.signOut()}
          >
            <Text style={buttonStyles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  placeholderText: {
    color: "#555",
  },
  verticallySpaced: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  buttonContainer: {
    marginBottom: 50,
  },
});
