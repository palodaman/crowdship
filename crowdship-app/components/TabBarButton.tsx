import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TabBarButton = (props: {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  icon: React.ReactNode;
}) => {
  const { isFocused, label, icon } = props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    // const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [-5, 3]); // Adjusted to move the icon up

    const color = isFocused ? "#47BF7E" : "black";

    return {
      // styles
      color,
      // transform: [{ scale: scaleValue }],
      top,
    };
  });

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {React.cloneElement(icon as React.ReactElement, {
          color: isFocused ? "#47BF7E" : "black",
        })}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color: isFocused ? "#47BF7E" : "black",
            fontSize: 10,
            alignContent: "center",
          },
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

export default TabBarButton;

/*This code was developed with the assistance of ChatGPT and Copilot*/