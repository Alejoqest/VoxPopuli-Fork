import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  status: "waiting" | "active" | "closed";
  color: string;
};

const pollCardState = ({ status, color }: Props) => {
  return (
    <View
      style={{
        paddingRight: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginVertical: 4,
        flexShrink: 1,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 8,
        }}
      />
      <Text variant="titleSmall" style={{ color: color }}>
        {status == "active" ? "Activo" : status == "waiting" ? "Espera" : "Cerrado"}
      </Text>
    </View>
  );
};

export default pollCardState;
