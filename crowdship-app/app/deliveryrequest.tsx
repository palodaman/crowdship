import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";
import buttonStyles from "../styles/buttonStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import Tooltip from 'react-native-walkthrough-tooltip';

const { width } = Dimensions.get("window");

export default function DeliveryRequest() {
  const [itemDescription, setItemDescription] = useState("");
  const [startingAddress, setStartingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [price, setPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pickupDateTime, setPickupDateTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const session = useSession();

  const [isItemDetailsValid, setIsItemDetailsValid] = useState(false);
  const [isAddressesValid, setIsAddressesValid] = useState(false);
  const [isDeliveryDetailsValid, setIsDeliveryDetailsValid] = useState(false);

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    setIsItemDetailsValid(itemDescription.trim() !== "");
    setIsAddressesValid(
      startingAddress.trim() !== "" && destinationAddress.trim() !== ""
    );
    setIsDeliveryDetailsValid(price.trim() !== "" && pickupDateTime !== null);
  }, [itemDescription, startingAddress, destinationAddress, price, pickupDateTime]);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
          notes: notes,
          views: 0,
        },
      ]);

      if (error) throw error;

      setMessage("Delivery request submitted successfully!");
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

  const showDateTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setPickupDateTime(date);
    hideDateTimePicker();
  };

  const openEstimatePriceModal = () => {
    setModalVisible(true);
  };

  const calculatePrice = () => {
    // Simple algorithm to calculate price based on dimensions, weight, and a mock distance
    const volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    const weightValue = parseFloat(weight);
    const mockDistance = 40; // Assuming a fixed distance for this example

    // Base price
    let calculatedPrice = 10;

    // Add price based on volume (assuming $1 per cubic foot)
    calculatedPrice += volume;

    // Add price based on weight (assuming $0.5 per kg)
    calculatedPrice += weightValue * 0.5;

    // Add price based on distance (assuming $1 per mile)
    calculatedPrice += mockDistance;

    //hardcoding for presentation
    calculatedPrice = 103.75

    // Round to 2 decimal places
    return calculatedPrice.toFixed(2);
  };

  const handleEstimate = () => {
    const estimatedPrice = calculatePrice();
    setPrice(estimatedPrice);
    setModalVisible(false);
  };

  // Custom styling for the progress steps
  const progressStepsStyle = {
    activeStepIconBorderColor: '#22C55E',
    activeLabelColor: '#47BF7E',
    activeStepNumColor: 'white',
    activeStepIconColor: '#47BF7E',
    completedStepIconColor: '#22C55E',
    completedProgressBarColor: '#22C55E',
    completedCheckColor: '#ffffff',
    labelFontSize: 14,
    labelColor: '#94A3B8',
    activeLabelFontSize: 14,
    disabledStepIconColor: '#E2E8F0',
    progressBarColor: '#E2E8F0',
  };

  const buttonTextStyle = {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  };

  return (
    <View style={styles.container}>
      <ProgressSteps {...progressStepsStyle}>
        <ProgressStep
          label="Item Details"
          nextBtnStyle={styles.nextButton}
          nextBtnTextStyle={buttonTextStyle}
          nextBtnDisabled={!isItemDetailsValid}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Item Details</Text>
            <TouchableOpacity
              style={[styles.uploadContainer, itemImageUrl && styles.uploadedContainer]}
              onPress={pickImage}
            >
              {itemImageUrl ? (
                <Image source={{ uri: itemImageUrl }} style={styles.itemImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <AntDesign name="camerao" size={32} color="#94A3B8" />
                  <Text style={styles.uploadText}>Upload Item Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Item Description <Text style={styles.mandatory}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item description"
                value={itemDescription}
                onChangeText={setItemDescription}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </ProgressStep>

        <ProgressStep
          label="Addresses"
          nextBtnStyle={styles.nextButton}
          previousBtnStyle={styles.previousButton}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={styles.previousButtonText}
          nextBtnDisabled={!isAddressesValid}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Pickup & Delivery</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pickup Address <Text style={styles.mandatory}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Pickup address"
                value={startingAddress}
                onChangeText={setStartingAddress}
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Delivery Address <Text style={styles.mandatory}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery address"
                value={destinationAddress}
                onChangeText={setDestinationAddress}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </ProgressStep>

        <ProgressStep
          label="Details"
          nextBtnStyle={styles.nextButton}
          previousBtnStyle={styles.previousButton}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={styles.previousButtonText}
          nextBtnDisabled={!isDeliveryDetailsValid}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Delivery Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price <Text style={styles.mandatory}>*</Text></Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="Set delivery price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
                <Tooltip
                  isVisible={tooltipVisible}
                  content={<Text>Enter item dimensions and weight</Text>}
                  placement="top"
                  onClose={() => setTooltipVisible(false)}
                >
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Feather name="info" size={24} color="#64748B" style={styles.infoIcon} />
                  </TouchableOpacity>
                </Tooltip>
              </View>
            </View>
            <Text style={styles.label}>Schedule Pickup <Text style={styles.mandatory}>*</Text></Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={showDateTimePicker}
            >
              <AntDesign name="calendar" size={24} color="#47BF7E" />
              <Text style={styles.datePickerButtonText}>
                {pickupDateTime
                  ? pickupDateTime.toLocaleString()
                  : "Select pickup date & time"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDateTimePicker}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any special instructions or notes"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </ProgressStep>

        <ProgressStep
          label="Payment"
          onSubmit={handleSubmit}
          nextBtnStyle={styles.submitButton}
          previousBtnStyle={styles.previousButton}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={styles.previousButtonText}
          finishBtnText="Pay & Submit"
        >
          <View style={styles.stepContainer}>
            <Text style={styles.paymentText}>Payment powered by Stripe</Text>
            <Text style={[styles.h1, { paddingTop: 10 }]}>Note: You will only be charged when a delivery is marked as complete</Text>

            <View style={styles.cardDetailsContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {isLoading && (
              <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
            )}
            {message !== "" && (
              <Text style={styles.message}>{message}</Text>
            )}
          </View>
        </ProgressStep>
      </ProgressSteps>

    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Estimate Delivery Price</Text>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>Dimensions (ft)</Text>
            <View style={styles.dimensionsContainer}>
              <TextInput
                style={[styles.modalInput, styles.dimensionInput]}
                value={length}
                onChangeText={setLength}
                keyboardType="numeric"
                placeholder="L"
              />
              <Text style={styles.dimensionSeparator}>x</Text>
              <TextInput
                style={[styles.modalInput, styles.dimensionInput]}
                value={width}
                onChangeText={setWidth}
                keyboardType="numeric"
                placeholder="W"
              />
              <Text style={styles.dimensionSeparator}>x</Text>
              <TextInput
                style={[styles.modalInput, styles.dimensionInput]}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="H"
              />
            </View>
          </View>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.modalInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Enter weight"
            />
          </View>
          <TouchableOpacity
            style={styles.estimateButton}
            onPress={handleEstimate}
          >
            <Text style={styles.estimateButtonText}>Estimate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadContainer: {
    width: width - 40,
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 24,
  },
  uploadedContainer: {
    borderStyle: 'solid',
    borderColor: '#22C55E',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  mandatory: {
    color: 'red',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  datePickerButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#64748B',
  },
  nextButton: {
    backgroundColor: '#47BF7E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 100,
    marginRight: -30,
  },
  previousButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 100,
    marginLeft: -30,
  },
  previousButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#47BF7E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 100,
    marginRight: -30,
  },
  loader: {
    marginTop: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#22C55E',
    textAlign: 'center',
  },
  paymentText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginTop: 50,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingRight: 10,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  infoIcon: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E293B',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
  },
  estimateButton: {
    backgroundColor: '#47BF7E',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 50,
    marginRight: 50,
  },
  estimateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  dimensionSeparator: {
    fontSize: 16,
    color: '#64748B',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  cardDetailsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
});

