import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../app/modulos/components/header/header";

const HomeScreen = lazy(() => import("../app/modulos/screens/home/home"));
const CreatePollScreen = lazy(
  () => import("../app/modulos/screens/createPoll/createPoll")
);
const PollInterfaceScreen = lazy(
  () => import("../app/modulos/screens/pollInterface/pollInterface")
);
const PollResultsScreen = lazy(
  () => import("../app/modulos/screens/pollResults/pollResults")
);
const BrowsePollsScreen = lazy(
  () => import("../app/modulos/screens/browsePolls/browsePolls")
);

export type AppStackParamList = {
  Home: undefined;
  CreatePoll: undefined;
  BrowsePoll: undefined;
  PollInterface: { id: number };
  PollResults: { id: number };
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

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: (props) => <Header {...props} />,
      }}
      initialRouteName={"Home"}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="CreatePoll"
        component={CreatePollScreen} // Avoid lazy-loading
      />
      <Stack.Screen
        name="PollInterface"
        component={PollInterfaceScreen} // Avoid lazy-loading
      />
      <Stack.Screen
        name="PollResults"
        component={PollResultsScreen} // Avoid lazy-loading
      />
      <Stack.Screen name="BrowsePoll" component={BrowsePollsScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
