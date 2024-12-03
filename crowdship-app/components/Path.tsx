import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import buttonStyles from "../styles/buttonStyles";
import fontStyles from "../styles/fontStyles";

interface PathProps {
  onButtonPress: (route: string) => void;
}

const Path: React.FC<PathProps> = ({ onButtonPress }) => {
  const navigateToRequestDelivery = () => {
    onButtonPress("/deliveryrequest");
  };

  const navigateToFindDeliveries = () => {
    onButtonPress("/googlemapscreen");
  };

  return (
    <View style={styles.content}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 100, height: 100, alignSelf: "center" }}
      />
      <Text
        style={[
          fontStyles.h1,
          { textAlign: "center", marginTop: 20, marginBottom: 20 },
        ]}
      >
        Whether you're sending or delivering, we make it simple, fast, and
        secure.
      </Text>

      <TouchableOpacity
        style={buttonStyles.primaryButton}
        onPress={navigateToRequestDelivery}
      >
        <Text style={buttonStyles.buttonText}>Send Packages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={buttonStyles.primaryButton}
        onPress={navigateToFindDeliveries}
      >
        <Text style={buttonStyles.buttonText}>Deliver Packages</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default Path;

/*This code was developed with the assistance of ChatGPT and Copilot*/