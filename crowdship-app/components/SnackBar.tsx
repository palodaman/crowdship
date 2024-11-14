import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Code provided by Prathiba Sugumar
// https://medium.com/@prathiba2796/custom-SnackBar-component-in-react-native-bab9d58f21e8

interface SnackbarProps {
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  position?: "top" | "bottom";
  containerStyle?: object;
  messageStyle?: object;
  actionTextStyle?: object;
  backgroundColor?: string;
  textColor?: string;
  actionTextColor?: string;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  actionText,
  onActionPress,
  isVisible,
  setIsVisible,
  position = "bottom", // Default position
  containerStyle,
  messageStyle,
  actionTextStyle,
  backgroundColor = "#333",
  textColor = "#fff",
  actionTextColor = "#ff0",
}) => {
  useEffect(() => {}, [isVisible, setIsVisible]);

  return isVisible ? (
    <View
      style={[
        styles.container,
        position === "top" ? styles.topContainer : styles.bottomContainer,
        containerStyle,
        { backgroundColor },
      ]}
    >
      <Text style={[styles.messageText, messageStyle, { color: textColor }]}>
        {message}
      </Text>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text
            style={[
              styles.actionText,
              actionTextStyle,
              { color: actionTextColor },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 75,
  },
  messageText: {
    fontSize: 16,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default Snackbar;
