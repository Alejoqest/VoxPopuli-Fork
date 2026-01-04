import React from "react";
import { VoteResult } from "../../../models/Vote";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  IconButton,
  MD3DarkTheme,
  Text,
} from "react-native-paper";
import { Colors } from "../../../../constants/colors";
import { AppStackParamList } from "../../../../../navigation/appStack";
import { NavigationProp } from "@react-navigation/native";

type Props = {
  votes?: VoteResult[];
  navigation: NavigationProp<AppStackParamList>;
};

const optionCountView = ({ votes, navigation }: Props) => {
  if (!votes)
    return (
      <ActivityIndicator
        animating
        color={MD3DarkTheme.colors.primary}
        size={"large"}
      />
    );

  return (
    <View style={styles.marginBottom}>
      {votes.map((v, i) => (
        <Card
          key={v.id}
          style={styles.marginBottom}
          onPress={() => navigation.navigate("VoteUser", { id: v.id })}
        >
          <Card.Title
            title={v.optionText}
            titleVariant="titleMedium"
            titleNumberOfLines={2}
            subtitle={v.numVotes + " Votos"}
            subtitleVariant="titleMedium"
            left={() => (
              <IconButton icon="circle-outline" containerColor={Colors[i]} />
            )}
            leftStyle={{ marginRight: 32 }}
            right={() => <Text>{v.percentageVotes}%</Text>}
            rightStyle={{ marginRight: 16 }}
          />
        </Card>
      ))}
    </View>
  );
};

export default optionCountView;

const styles = StyleSheet.create({
  marginBottom: { marginBottom: 16 },
});
