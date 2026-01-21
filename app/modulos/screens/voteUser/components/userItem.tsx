import React from "react";
import { VoteUser } from "../../../models/Vote";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../../navigation/appStack";
import AvatarIcon from "../../../components/avatarIcon/avatarIcon";
import { IconButton, List } from "react-native-paper";

type Props = {
  vote: VoteUser;
  navigation: NavigationProp<AppStackParamList>;
};

const userItem = ({ vote, navigation }: Props) => {
  return (
    <List.Item
      title={vote.profile?.username || "Desconocido"}
      left={() => <AvatarIcon size={45} profile={vote.profile} />}
      right={() => vote.profile && <IconButton icon="chevron-right" onPress={() => navigation.navigate("Profile", {id : vote.profile?.id!})}/>}
      titleNumberOfLines={1}
      style={{
        padding: 8,
      }}
    />
  );
};

export default userItem;
