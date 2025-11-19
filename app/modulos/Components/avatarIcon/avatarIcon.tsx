import React from "react";
import { Avatar } from "react-native-paper";
import { ProfileAvatar } from "../../models/Profile";
import { ExtraColors } from "../../../constants/colors";

type props = {
  size: number;
  profile?: ProfileAvatar;
};

const AvatarIcon = ({ size, profile }: props) => {
  return (
    <Avatar.Text
      size={size}
      label={profile?.username.slice(0, 1) || "U"}
      style={{ backgroundColor: profile?.color || ExtraColors.empty }}
    />
  );
};

export default AvatarIcon;
