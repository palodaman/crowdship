import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url); // Set the avatar URL from the profile data
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, avatar_url }: { username: string; avatar_url: string | null }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      Alert.alert('Profile updated!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Function to handle the image picking
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission to access camera roll is required!');
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
      setAvatarUrl(pickedUri); // Update the avatar URL state
      // Update the profile with the new avatar URL
      await updateProfile({ username, avatar_url: pickedUri });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {/* Render image if avatarUrl exists, otherwise show the Upload button */}
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title={loading ? 'Loading ...' : 'Update'} onPress={() => updateProfile({ username, avatar_url: avatarUrl })} disabled={loading} />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10, // Reduced margin to bring profile pic higher
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 10, // Slightly adjusted for better alignment
    paddingBottom: 10,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20, // Keep consistent margin for elements below avatar
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 15, // Reduced margin to position profile pic higher
  },
  avatar: {
    width: 150,  // Bigger profile picture
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  uploadButton: {
    width: 150,  // Match size with avatar for consistency
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  uploadText: {
    color: '#555',
  },
});
