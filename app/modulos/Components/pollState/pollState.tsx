import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { ExtraColors } from "../../../constants/colors";

type Props = {
  status: "waiting" | "active" | "closed";
};

const pollState = ({ status }: Props) => {

    const color = status == "active"
                  ? ExtraColors.open
                  : status == "waiting"
                  ? ExtraColors.empty
                  : ExtraColors.closed;
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

export default pollState;
