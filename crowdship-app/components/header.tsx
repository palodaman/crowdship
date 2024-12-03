import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";

export default function Header({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
});

/*This code was developed with the assistance of ChatGPT and Copilot*/