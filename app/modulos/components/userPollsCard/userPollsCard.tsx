import React from "react";
import { StyleSheet } from "react-native";
import { Card, Divider, Icon, MD3DarkTheme, Text } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../navigation/appStack";
import { Poll } from "../../models/Polls";
import PollState from "../pollState/pollState";

type props = {
  poll: Poll;
  navigation: NavigationProp<AppStackParamList>;
};

const userPollsCard = ({ poll, navigation }: props) => {
  const handlePress = () => {
    navigation.navigate("PollInterface", { id: poll.id });
  };

  return (
    <Card style={styles.text} onPress={handlePress}>
      <Card.Title
        title={poll.title}
        titleNumberOfLines={3}
        titleVariant="titleLarge"
        style={styles.title}
        right={() => <PollState status={poll.status} />}
      />
      <Divider style={styles.text} />
      <Card.Content style={styles.cardContent}>
        <Text variant="bodyMedium">
          <Icon
            source="calendar-start-outline"
            color={MD3DarkTheme.colors.primary}
            size={16}
          />{" "}
          Inicio: {new Date(poll.start_time).toLocaleDateString("es")}{" "}
          {new Date(poll.start_time).toLocaleTimeString("es", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 6 }}>
          <Icon
            source="timer-outline"
            color={MD3DarkTheme.colors.primary}
            size={16}
          />{" "}
          Fin: {new Date(poll.end_time).toLocaleDateString("es")}{" "}
          {new Date(poll.end_time).toLocaleTimeString("es", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default userPollsCard;

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
  },
  text: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
  },
  inputHalf: {
    width: "48%",
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
