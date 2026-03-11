import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../../navigation/appStack";
import { Divider, List } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Poll } from "../../../models/Polls";
import PollItem from "./pollItem";

type Props = {
  polls: Poll[];
  navigation: NavigationProp<AppStackParamList>;
};

const PollList = ({ polls, navigation }: Props) => {
  return (
    <List.Section style={{ margin: 0 }}>
      <Divider style={styles.text} />
      {polls.length == 0 ? (
        <List.Item title="No hay votos" titleStyle={{ textAlign: "center" }} />
      ) : (
        polls.map((p) => {
          return (
            <PollItem
              key={p.id}
              poll={p}
              navigation={navigation}
            />
          );
        })
      )}
    </List.Section>
  );
};

export default PollList;

const styles = StyleSheet.create({
  text: { marginBottom: 16 },
});
