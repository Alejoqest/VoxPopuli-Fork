import React, { useContext, useState } from "react";
import { Appbar, Divider, IconButton, Menu } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { authService } from "../../../../backend/services/authService";
import Logo from "../logo/logo";
import { AuthContext } from "../../context/authContext";

type ProfileParams = {
  id?: string;
};

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const { userId } = useContext(AuthContext);
  const params = route.params as ProfileParams | undefined;
  const profileId = params?.id;
  const title = getHeaderTitle(options, route.name);
  const isOwnProfile = userId === profileId && title == "Profile";
  const [visible, setVisible] = useState(false);
  const showBackButton = back && !isOwnProfile;

  const handleHome = () => {
    if (title == "Profile" && isOwnProfile) return;
    navigation.replace("Profile", { id: userId });
  };

  const handleLogout = async () => {
    await authService.logoutUser();
  };

  const openMenu = (): void => setVisible(true);

  const closeMenu = (): void => setVisible(false);

  return (
    <Appbar.Header
      style={{ backgroundColor: "black", justifyContent: "center" }}
    >
      {showBackButton ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : null}

      <Appbar.Content title={<Logo inline />} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton icon={"menu"} iconColor="white" onPress={openMenu} />
        }
      >
        {back && showBackButton ? (
          <>
            <Menu.Item
              onPress={handleHome}
              title="Hogar"
              leadingIcon={"home"}
            />
            <Divider />
          </>
        ) : null}
        <Menu.Item
          onPress={handleLogout}
          title="Cerrar Sesión"
          leadingIcon="logout"
        />
      </Menu>
    </Appbar.Header>
  );
};

export default Header;
