import { StyleSheet } from "react-native";

const fontStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#07181D",
    marginBottom: 20,
  },

  // Headers
  h1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#07181D",
  },

  // Normal text
  text: {
    fontSize: 16,
    color: "#07181D",
  },
  redText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  greyText: {
    fontSize: 16,
    color: "#7F8A94",
  },
  greenText: {
    fontSize: 16,
    color: "#47BF7E",
    textAlign: "center",
  },
  whiteText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },

  // Special text
  boldedText: {
    fontSize: 16,
    color: "#07181D",
    fontWeight: "bold",
  },
});

export default fontStyles;
