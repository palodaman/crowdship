import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  Modal, 
  FlatList 
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import fontStyles from '../styles/fontStyles';
import { AntDesign } from '@expo/vector-icons';
import buttonStyles from '../styles/buttonStyles';

const FeedbackScreen = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [feedbackType, setFeedbackType] = useState('bug');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const feedbackOptions = [
    { label: 'Bug Report', value: 'bug' },
    { label: 'Feature Request', value: 'feature_request' },
    { label: 'General Feedback', value: 'general_feedback' },
    { label: 'Other', value: 'other' },
  ];

  const handleSubmit = async () => {
    try {
      if (!description.trim()) {
        Alert.alert('Error', 'Please enter a description');
        return;
      }

      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: userId,
            report_type: feedbackType,
            description: description.trim(),
            status: 'open',
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Feedback submitted successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={[fontStyles.title, styles.headerTitle]}>Submit Feedback</Text>
      </View>

      <View style={styles.form}>
        <Text style={fontStyles.boldedText}>      Feedback Type</Text>
        <View style={styles.centeredContainer}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {feedbackOptions.find(option => option.value === feedbackType)?.label}
            </Text>
            <AntDesign name="down" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={feedbackOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setFeedbackType(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <Text style={[fontStyles.boldedText, styles.label]}>      Description</Text>
        <View style={styles.centeredContainer}>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            placeholder="Please describe your feedback..."
          />
        </View>

        <TouchableOpacity 
          style={buttonStyles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={buttonStyles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  centeredContainer: {
    alignItems: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '80%',
    maxHeight: '50%',
    padding: 15,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 30,
    width: '90%',
  },
  submitButton: {
    backgroundColor: '#5DE49B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
