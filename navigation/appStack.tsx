import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy, ReactNode, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../app/modulos/components/header/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../app/modulos/context/authContext";

const ProfileScreen = lazy(
  () => import("../app/modulos/screens/profile/profile"),
);
const CreatePollScreen = lazy(
  () => import("../app/modulos/screens/createPoll/createPoll"),
);
const PollInterfaceScreen = lazy(
  () => import("../app/modulos/screens/pollInterface/pollInterface"),
);
const PollResultsScreen = lazy(
  () => import("../app/modulos/screens/pollResults/pollResults"),
);
const BrowsePollsScreen = lazy(
  () => import("../app/modulos/screens/browsePolls/browsePolls"),
);
const VoteUserScreen = lazy(
  () => import("../app/modulos/screens/voteUser/voteUser"),
);
const PollUserScreen = lazy(
  () => import("../app/modulos/screens/pollUser/pollUser"),
);

export type AppStackParamList = {
  Profile: { id?: string };
  CreatePoll: undefined;
  BrowsePoll: undefined;
  PollInterface: { id: number };
  PollResults: { id: number };
  PollUser: { id: string };
  VoteUser: { id: number };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

type PollInterfaceScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "PollInterface"
>;

type PollResultsScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "PollResults"
>;

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userId }}>{children}</AuthContext.Provider>
  );
};

const AppStack = () => {
  return (
    <AuthProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: (props) => <Header {...props} />,
        }}
        initialRouteName={"Profile"}
      >
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CreatePoll" component={CreatePollScreen} />
        <Stack.Screen name="PollInterface" component={PollInterfaceScreen} />
        <Stack.Screen name="PollResults" component={PollResultsScreen} />
        <Stack.Screen name="BrowsePoll" component={BrowsePollsScreen} />
        <Stack.Screen name="VoteUser" component={VoteUserScreen} />
        <Stack.Screen name="PollUser" component={PollUserScreen} />
      </Stack.Navigator>
    </AuthProvider>
  );
};

export default AppStack;
