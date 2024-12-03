import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Input } from "@rneui/themed";
import { useNavigation } from "expo-router";
import buttonStyles from "../styles/buttonStyles";
import fontStyles from "../styles/fontStyles";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const navigation = useNavigation(); // Use useNavigation to navigate between screens

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  function handleSignUpNavigate() {
    // Navigate to the SignUpScreen
    navigation.navigate("SignUpScreen");
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 100, height: 100, alignSelf: "center" }}
      />
      <Text style={[fontStyles.title, { fontSize: 30 }]}>
        Welcome to CrowdShip
      </Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "antdesign", name: "mail" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "antdesign", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={buttonStyles.primaryButton}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          <Text style={buttonStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity
          style={buttonStyles.primaryButton}
          onPress={handleSignUpNavigate}
          disabled={loading}
        >
          <Text style={buttonStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
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

/*This code was developed with the assistance of ChatGPT and Copilot*/