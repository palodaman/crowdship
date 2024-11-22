import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { Input } from "@rneui/themed";
import buttonStyles from "../styles/buttonStyles";
import fontStyles from "../styles/fontStyles";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  async function signUpWithEmail() {
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
      Alert.alert("Success", "Check your email for the one time password code");
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
    <ScrollView>
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
              style={buttonStyles.primaryButton}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              <Text style={buttonStyles.buttonText}>
                {loading ? "Loading..." : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
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
});
