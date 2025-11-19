import React from "react";
import { View } from "react-native";
import { ActivityIndicator, MD3DarkTheme } from "react-native-paper";
import GradientBackground from "../gradientBackground/gradientBackground";

const loading = () => {
  return (
    <GradientBackground>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          animating
          color={MD3DarkTheme.colors.primary}
          size={"large"}
        />
      </View>
    </GradientBackground>
  );
};

export default loading;
