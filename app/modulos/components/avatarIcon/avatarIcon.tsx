import React from "react";
import { Avatar } from "react-native-paper";
import { ProfileAvatar } from "../../models/Profile";
import { ExtraColors } from "../../../constants/colors";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../navigation/appStack";

type props = {
  size: number;
  profile?: ProfileAvatar | null;
  navigation?: NavigationProp<AppStackParamList>;
};

const AvatarIcon = ({ size, profile, navigation }: props) => {
  return (
    <Avatar.Text
      size={size}
      label={profile?.username.slice(0, 1) || "U"}
      style={{ backgroundColor: profile?.color || ExtraColors.empty }}
      onPointerDown={() => (navigation && profile) && navigation.navigate("Profile", {id : profile?.id})}
    />
  );
};

export default AvatarIcon;
