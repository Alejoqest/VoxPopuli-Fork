import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, IconButton, Surface, useTheme } from "react-native-paper";

type props = {
  error?: string;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
};


const AuthError = ({ error, setError }: props) => {
    const colors = useTheme();

  if (!error) return null;

  return (
    <Surface elevation={1} mode="flat" style={[styles.container, {backgroundColor: colors.colors.errorContainer}]}>
      <HelperText type="error" visible>
        {error}
      </HelperText>
      <IconButton icon={"close"} iconColor={colors.colors.error} onPress={() => setError(undefined)} />
    </Surface>
  );
};

export default AuthError;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: "8px",
  },
});
