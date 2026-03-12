import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../../navigation/appStack";
import AvatarIcon from "../../../components/avatarIcon/avatarIcon";
import { IconButton, List } from "react-native-paper";
import { Poll } from "../../../models/Polls";
import PollState from "../../../components/pollState/pollState";

type Props = {
  poll: Poll;
  navigation: NavigationProp<AppStackParamList>;
};

const PollItem = ({ poll, navigation }: Props) => {
  return (
    <List.Item
      title={poll.title}
      description={poll.description}
      right={() => <PollState status={poll.status}/>}
      titleNumberOfLines={1}
      descriptionNumberOfLines={2}
      style={{
        padding: 8,
        borderRadius: 15,
      }}
      onPress={() => navigation.navigate("PollInterface", {id : poll.id})}
    />
  );
};
  
export default PollItem;
