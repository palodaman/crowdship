import React, { useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { Input } from "@rneui/themed";
import buttonStyles from "../styles/buttonStyles";
import fontStyles from "../styles/fontStyles";
import Checkbox from 'expo-checkbox';

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const termsScrollViewRef = useRef<ScrollView>(null);

  async function signUpWithEmail() {
    if (!agreedToTerms) {
      Alert.alert("Error", "You must agree to the Terms and Conditions to sign up.");
      return;
    }

    setLoading(true);
    try {
      // Request OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            username,
            first_name: firstname,
            last_name: lastname,
          },
        },
      });

      if (error) throw error;

      setShowOTPInput(true);
      Alert.alert("Success", "Check your email for the one-time password code");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    setLoading(true);
    try {
      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (data?.user) {
        // Set password after successful OTP verification
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) throw updateError;

        Alert.alert(
          "Success",
          "Sign up successful! You can now login with your email and password.",
          [
            {
              text: "OK",
              onPress: () => {
                router.push("/");
              },
            },
          ]
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView persistentScrollbar={true}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 100, height: 100, alignSelf: "center" }}
        />
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="First Name"
            onChangeText={(text) => setFirstname(text)}
            value={firstname}
            placeholder="First name"
            autoCapitalize={"none"}
            disabled={showOTPInput}
            labelStyle={fontStyles.h1}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Last Name"
            onChangeText={(text) => setLastname(text)}
            value={lastname}
            placeholder="Last name"
            autoCapitalize={"none"}
            disabled={showOTPInput}
            labelStyle={fontStyles.h1}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Username"
            autoCapitalize={"none"}
            disabled={showOTPInput}
            labelStyle={fontStyles.h1}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            disabled={showOTPInput}
            labelStyle={fontStyles.h1}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            disabled={showOTPInput}
            labelStyle={fontStyles.h1}
          />
        </View>

        {/* Terms and Conditions Checkbox and Modal */}
        <View style={[styles.verticallySpaced, styles.mt20, styles.termsContainer]}>
          <Checkbox
            value={agreedToTerms}
            onValueChange={() => setIsModalVisible(true)}
            disabled={!agreedToTerms}
          />
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={{ textDecorationLine: "underline", color: "#007BFF", marginLeft: 10 }}>
              Terms and Conditions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        {showOTPInput ? (
          <>
            <View style={styles.verticallySpaced}>
              <Input
                label="One time password"
                onChangeText={(text) => setOtp(text)}
                value={otp}
                placeholder="Enter OTP code"
                autoCapitalize={"none"}
              />
            </View>
            <View style={styles.verticallySpaced}>
              <TouchableOpacity
                style={buttonStyles.primaryButton}
                onPress={verifyOTP}
                disabled={loading}
              >
                <Text style={buttonStyles.buttonText}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.verticallySpaced}>
            <TouchableOpacity
              style={[buttonStyles.primaryButton, { opacity: agreedToTerms ? 1 : 0.5 }]}
              onPress={signUpWithEmail}
              disabled={loading || !agreedToTerms}
            >
              <Text style={buttonStyles.buttonText}>
                {loading ? "Loading..." : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal for Terms and Conditions */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
            </View>
            <ScrollView
              ref={termsScrollViewRef}
              style={styles.modalScrollView}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  setAgreedToTerms(true);
                }
              }}
            >
              <Text style={styles.modalContent}>
                {"CrowdShip User Agreement and Privacy Policy\n\n"}
                <Text style={styles.sectionHeader}>Welcome to CrowdShip!</Text> {"\n\n"}
                Please read the following terms and policies carefully before using our platform. This User Agreement and Privacy Policy constitute a legal agreement between you and CrowdShip, governing your access to and use of our services.{"\n\n"}
                
                <Text style={styles.sectionHeader}>User Agreement</Text> {"\n\n"}
                <Text style={styles.boldText}>1. Service Overview</Text> {"\n"}
                CrowdShip provides a delivery platform connecting senders (Shippers) with drivers (Drivers) for flexible and efficient delivery services. Through this platform, you can create orders, track packages, and make payments.{"\n\n"}

                <Text style={styles.boldText}>2. User Eligibility</Text> {"\n"}
                You must be at least 18 years old and have full legal capacity to use CrowdShip's services. When registering, you must provide accurate and truthful personal information.{"\n\n"}

                <Text style={styles.boldText}>3. User Responsibilities</Text> {"\n"}
                - <Text style={styles.italicText}>Shippers’ Responsibilities:</Text> {"\n"}
                  - Ensure that packages comply with the platform's prohibited items policy and do not contain any illegal or restricted goods.{"\n"}
                  - Provide accurate package dimensions, pick-up, and delivery addresses.{"\n"}
                  - Assume the risk for uninsured packages during transit.{"\n\n"}

                - <Text style={styles.italicText}>Drivers’ Responsibilities:</Text> {"\n"}
                  - Ensure timely pick-up and delivery of packages.{"\n"}
                  - Do not tamper with or damage packages.{"\n"}
                  - Follow traffic regulations and ensure transportation safety.{"\n\n"}

                {/* Add more sections as needed */}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={() => {
                setIsModalVisible(false);
                setAgreedToTerms(true);
              }}
            >
              <Text style={buttonStyles.buttonText}>Agree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    width: "90%",
    marginTop: 60,
    marginBottom: 60,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  closeButton: {
    fontSize: 24,
    color: "red",
    fontWeight: "bold",
    padding: 5,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  italicText: {
    fontStyle: "italic",
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
});
