import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../../navigation/appStack";
import AvatarIcon from "../../../components/avatarIcon/avatarIcon";
import { IconButton, List } from "react-native-paper";
import { Poll } from "../../../models/Polls";

type Props = {
  poll: Poll;
  navigation: NavigationProp<AppStackParamList>;
};

const PollItem = ({ poll, navigation }: Props) => {
  return (
    <List.Item
      title={poll.title}
      left={() => <AvatarIcon size={45} profile={poll.profile} />}
      right={() => poll.profile && <IconButton icon="chevron-right" onPress={() => navigation.navigate("PollInterface", {id : poll.id})}/>}
      titleNumberOfLines={1}
      style={{
        padding: 8,
      }}
    />
  );
};

export default PollItem;
