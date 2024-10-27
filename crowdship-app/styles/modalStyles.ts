import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "grey",
    fontWeight: "bold",
  },
});

export default modalStyles;
