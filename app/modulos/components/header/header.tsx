import React, { useState } from "react";
import { Appbar, Divider, IconButton, Menu } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { authService } from "../../../../backend/services/authService";
import Logo from "../logo/logo";

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const title = getHeaderTitle(options, route.name);
  const [visible, setVisible] = useState(false);

  const navigate = (route: string): void => {
    navigation.navigate(route);
    closeMenu();
  };

  const handleLogout = async () => {
    await authService.logoutUser();
    navigation.navigate("Login");
  };

  const openMenu = (): void => setVisible(true);

  const closeMenu = (): void => setVisible(false);

  return (
    <Appbar.Header
      style={{ backgroundColor: "black", justifyContent: "center" }}
    >
      {back && title !== "Home" ? (
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
        {back && title !== "Home" ? (
          <>
            <Menu.Item
              onPress={() => navigate("Home")}
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
