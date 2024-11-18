import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

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
      <Text style={styles.heading}>Got a Package? Let Us Handle It!</Text>
      <Text style={styles.subheading}>
        Whether you're sending or delivering, we make it simple, fast, and secure.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={navigateToRequestDelivery}
      >
        <Text style={styles.buttonText}>Send a Package – Fast & Secure!</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={navigateToFindDeliveries}
      >
        <Text style={styles.buttonText}>Looking for extra income? Deliver packages along your route!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#07181D",
    marginBottom: 10,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "400",
    color: "#7F8A94",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
  },
});

export default Path;
