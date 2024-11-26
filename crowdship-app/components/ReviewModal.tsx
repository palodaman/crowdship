import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { supabase } from '../lib/supabase';
import buttonStyles from "../styles/buttonStyles"; 
import fontStyles from "../styles/fontStyles";
import Icon from 'react-native-vector-icons/FontAwesome';

interface ReviewModalProps {
  reviewData: {
    orderid: string;
    delivererid: string;
    senderid: string;
    reviewtype: string; // "sendertodriver" | "drivertosender"
  };
  onSubmitReview: () => void; 
}

const MAX_REVIEW_LENGTH = 200;

const ReviewModal: React.FC<ReviewModalProps> = ({
  reviewData,
  onSubmitReview
}) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const userIdToFetch = 
    reviewData.reviewtype === "sendertodriver" ? reviewData.delivererid : reviewData.senderid;

  useEffect(() => {
    fetchUserInfo(userIdToFetch);
    checkIfReviewExists();
  }, [userIdToFetch]);

  const fetchUserInfo = async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('userid', id)
      .single();

    if (data) {
      setUsername(data.username);
      setAvatar(data.avatar_url);
    }
  };

  const checkIfReviewExists = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, reviewtext')
      .eq('orderid', reviewData.orderid)
      .eq('reviewtype', reviewData.reviewtype)
      .single();

    if (data) {
      setRating(data.rating);
      setReviewText(data.reviewtext);
      setHasSubmitted(true);
    }
  };

  const handleStarPress = (star: number) => setRating(star);

  const handleSubmit = async () => {
    if (rating > 0 && !hasSubmitted) {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            orderid: reviewData.orderid,
            senderid: reviewData.senderid,
            delivererid: reviewData.delivererid,
            rating: rating,
            reviewtext: reviewText,
            reviewtype: reviewData.reviewtype,
          },
        ]);
      if (!error) {
        setHasSubmitted(true);
        setTimeout(() => {
          onSubmitReview();
        }, 1000);
      }
    } else {
      alert("Please select a rating before submitting.");
    }
  };

  const reviewPrompt = 
    reviewData.reviewtype === "sendertodriver" ? "Driver Rating & Review" : "Sender Rating & Review";

  return (
    <View style={styles.modal}>
      <Text style={[fontStyles.title, styles.prompt]}>{reviewPrompt}</Text>

      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="user" size={50} color="#999" />
          </View>
        )}
        <Text style={fontStyles.h1}>{username || 'Loading...'}</Text>
      </View>
      
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)} disabled={hasSubmitted}>
            <Text style={[fontStyles.text, styles.star, star <= rating && styles.filledStar]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Write an optional review..."
        multiline
        value={reviewText}
        onChangeText={(text) => setReviewText(text.length <= MAX_REVIEW_LENGTH ? text : reviewText)}
        editable={!hasSubmitted}
        maxLength={MAX_REVIEW_LENGTH}
      />
      <Text style={styles.characterCount}>
        {reviewText.length}/{MAX_REVIEW_LENGTH} characters
      </Text>

      {!hasSubmitted && (
        <TouchableOpacity
          style={buttonStyles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={buttonStyles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      )}
      {hasSubmitted && (
        <Text style={fontStyles.text}>You have already submitted your review.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  prompt: {
    marginBottom: 20,
    textAlign: "center",
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  star: {
    fontSize: 30,
    color: "#ccc",
    marginHorizontal: 5,
  },
  filledStar: {
    color: "#5DE49B",
  },
  textInput: {
    width: "100%",
    borderColor: "#7F8A94",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#7F8A94",
    paddingBottom: 10,
  },
});

export default ReviewModal;
