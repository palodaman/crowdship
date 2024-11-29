import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Divider } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import fontStyles from "../styles/fontStyles";
import { AntDesign } from "@expo/vector-icons";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface review {
  ratingid: string;
  orderid: string;
  senderid: string;
  delivererid: string;
  rating: number;
  reviewtext: string;
  createdate: string;
  reviewtype: string;
  username: string;
  first_name: string;
  last_name: string;
  profiles: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

interface Profile {
  userid: string;
  updated_at: string;
  username: string;
  first_name: string;
  avatar_url: string;
  dob: string;
  email: string;
  phonenumber: string;
  profileimageurl: string;
  password: string;
  last_name: string;
  created_at: string;
}

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [senderReviews, setSenderReviews] = useState<review[]>([]);
  const [delivererReviews, setDelivererReviews] = useState<review[]>([]);
  const [profile, setProfile] = useState<Profile | any>(null);
  const [averageSenderRating, setAverageSenderRating] = useState("0");
  const [averageDelivererRating, setAverageDelivererRating] = useState("0");

  useEffect(() => {
    if (session) {
      getProfile();
      getUsername();
      getReviews();
    }
  }, [session]);

  useEffect(() => {
    setAverageSenderRating(getAvgRating(senderReviews));
    setAverageDelivererRating(getAvgRating(delivererReviews));
  }, [senderReviews, delivererReviews]);

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("userid", session?.user.id);

      if (data) {
        setAvatarUrl(data[0].avatar_url); // Set the avatar URL from the profile data
        setProfile(data[0]);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getReviews = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // Query to get reviews written by senders for the user
      const { data: senderReviewData, error: senderError } = await supabase
        .from("reviews")
        .select(
          `
      *,
     profiles!reviews_senderid_fkey(username, first_name, last_name)
    `
        )
        .eq("delivererid", session?.user.id)
        .eq("reviewtype", "sendertodriver");

      if (senderError) {
        throw senderError;
      }

      // Query to get reviews written by deliverers for the user
      const { data: delivererReviewData, error: delivererError } =
        await supabase
          .from("reviews")
          .select(
            `
      *,
      profiles!reviews_delivererid_fkey(username, first_name, last_name)
    `
          )
          .eq("senderid", session?.user.id)
          .eq("reviewtype", "drivertosender");

      if (delivererError) {
        throw delivererError;
      }

      if (senderReviewData) {
        setSenderReviews(senderReviewData);
      }

      if (delivererReviewData) {
        setDelivererReviews(delivererReviewData);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

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

  const getAvgRating = (reviews: review[]) => {
    if (reviews?.length === 0) return "0";
    const totalRating = reviews.reduce(
      (sum, review) => sum + review?.rating,
      0
    );
    return (totalRating / reviews?.length).toFixed(1).toString();
  };

  const getJoinDateMessage = (createAt: string) => {
    const joinDate = new Date(createAt);
    const currentYear = new Date().getFullYear();
    const joinYear = joinDate.getFullYear();
    const yearsAgo = currentYear - joinYear;
    return yearsAgo.toString();
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

  const renderStars = (rating: number) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={[
            fontStyles.text,
            styles.star,
            star <= rating && styles.filledStar,
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("senderReviews", senderReviews);
  console.log("delivererReviews", delivererReviews);
  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <AntDesign name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.verticallySpaced}>
        <View style={styles.avatarContainer}>
          {/* Render image if avatarUrl exists, otherwise display placeholder */}
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AntDesign name="user" size={50} color="#555" />
            </View>
          )}
        </View>
        <Text style={[fontStyles.title, { textAlign: "center" }]}>
          {profile?.first_name + " " + profile?.last_name}
        </Text>

        <View style={styles.ratingContainer}>
          {senderReviews.length > 0 ? (
            <View style={styles.bioInfo}>
              <Text style={fontStyles.text}>{averageSenderRating} ★</Text>
              <Text style={fontStyles.text}>Driver Rating</Text>
            </View>
          ) : (
            <Text style={[fontStyles.text, { width: "30%", marginLeft: 20 }]}>
              No Driver Ratings
            </Text>
          )}

          <View style={styles.verticalDivider} />
          {delivererReviews.length > 0 ? (
            <View style={styles.bioInfo}>
              <Text style={fontStyles.text}>{averageDelivererRating} ★</Text>
              <Text style={fontStyles.text}>Sender Rating</Text>
            </View>
          ) : (
            <Text style={[fontStyles.text, { width: "30%" }]}>
              No Sender Ratings
            </Text>
          )}

          <View style={styles.verticalDivider} />
          {getJoinDateMessage(profile?.created_at) === "0" ? (
            <Text style={[fontStyles.text, { width: "30%" }]}>
              Joined {new Date(profile?.created_at).getFullYear()}
            </Text>
          ) : (
            <View style={styles.bioInfo}>
              <Text style={fontStyles.text}>
                {getJoinDateMessage(profile?.created_at)}
              </Text>
              <Text style={fontStyles.text}>Years Shipping</Text>
            </View>
          )}
        </View>

        <Divider style={{ marginBottom: 15 }} />

        <View style={styles.buttonContainer}>
          <Text style={[fontStyles.h1, { marginTop: 20 }]}>
            How others find me as a driver?
          </Text>
          {senderReviews.length === 0 ? (
            <Text style={fontStyles.text}>
              I have no reviews from other senders.
            </Text>
          ) : (
            senderReviews.map((review) => (
              <View key={review.ratingid} style={styles.card}>
                {renderStars(review.rating)}
                <Text style={fontStyles.text}>{review.reviewtext}</Text>
                <Text style={fontStyles.greyText}>
                  - {review.profiles.first_name}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={[fontStyles.h1, { marginTop: 10 }]}>
          How others find me as a sender?
        </Text>
        {delivererReviews.length === 0 ? (
          <Text style={fontStyles.text}>
            I have no reviews from other drivers.
          </Text>
        ) : (
          delivererReviews.map((driverReview) => (
            <View key={driverReview.ratingid} style={styles.card}>
              {renderStars(driverReview.rating)}
              <Text style={fontStyles.text}>{driverReview.reviewtext}</Text>
              <Text style={fontStyles.greyText}>
                - {driverReview.profiles.first_name}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 2,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  star: {
    fontSize: 15,
    color: "#ccc",
    marginHorizontal: 5,
  },
  filledStar: {
    color: "#5DE49B",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  bioInfo: {
    flexDirection: "column",
    alignItems: "center",
  },
});
