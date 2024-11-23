import { StyleSheet } from "react-native";

const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#47BF7E",
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
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#47BF7E",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default buttonStyles;
