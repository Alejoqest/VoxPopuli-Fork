import React from "react";
import { VoteResult } from "../../../models/Vote";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  MD3DarkTheme,
  Surface,
  Text,
} from "react-native-paper";
import { Colors } from "../../../../constants/colors";

type Props = {
  votes?: VoteResult[];
};

const optionCountView = ({ votes }: Props) => {
  if (!votes)
    return (
      <ActivityIndicator
        animating
        color={MD3DarkTheme.colors.primary}
        size={"large"}
      />
    );

  return (
    <View style={styles.text}>
      {votes.map((v, i) => (
        <Surface
          key={v.id}
          style={[
            styles.surface,
            styles.textSuface,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton icon="circle-outline" containerColor={Colors[i]} />
            <Text variant="titleMedium">
              {v.optionText + "\n"}
              {v.numVotes} Votos
            </Text>
          </View>
          <Text variant="titleMedium">{v.percentageVotes}%</Text>
        </Surface>
      ))}
    </View>
  );
};

export default optionCountView;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: { marginTop: 16, marginBottom: 16 },
  text: { marginBottom: 16 },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 20,
    paddingLeft: 22,
  },
  textSuface: {
    padding: 12,
    paddingLeft: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
