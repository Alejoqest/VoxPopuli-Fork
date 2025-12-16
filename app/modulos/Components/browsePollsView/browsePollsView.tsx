import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Divider,
  MD3DarkTheme,
  Text,
} from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../navigation/appStack";
import BrowsePollsCard from "../browsePollsCard/browsePollsCard";
import { Poll } from "../../models/Polls";
import UserPollsCard from "../userPollsCard/userPollsCard";

type props = {
  type: "user" | "browse";
  polls?: Poll[];
  navigation: NavigationProp<AppStackParamList>;
};

const browsePollsView = ({ type, polls, navigation }: props) => {
  return (
    <View>
      <Divider style={styles.text} />
      {!polls ? (
        <ActivityIndicator
          animating
          color={MD3DarkTheme.colors.primary}
          size={"large"}
        />
      ) : polls.length !== 0 ? (
        polls.map((v) => {
          return type == "browse" ? (
            <BrowsePollsCard key={v.id} poll={v} navigation={navigation} />
          ) : (
            <UserPollsCard key={v.id} poll={v} navigation={navigation} />
          );
        })
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text variant="titleLarge">No hay encuestas encontradas</Text>
        </View>
      )}
    </View>
  );
};

export default browsePollsView;

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
