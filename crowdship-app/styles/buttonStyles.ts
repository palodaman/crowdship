import { StyleSheet } from "react-native";

const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#5DE49A",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "#07181D",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  tertiaryButton: {
    backgroundColor: "#white",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#7F8A94",
    borderStyle: "solid",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  tertiaryButtonText: {
    color: "#7F8A94",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default buttonStyles;
