import { StyleSheet } from "react-native";

const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#5DE49A",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "#07181D",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  tertiaryButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default buttonStyles;
