import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy } from "react";

const Header = lazy(() => import('../app/modulos/components/header/header'));
const HomeScreen = lazy(() => import('../app/modulos/screens/home/home'));
const CreatePollScreen = lazy(() => import('../app/modulos/screens/createPoll/createPoll'));
const PollInterfaceScreen = lazy(() => import('../app/modulos/screens/pollInterface/pollInterface'));
const PollResultsScreen = lazy(() => import('../app/modulos/screens/pollResults/pollResults'));
const BrowsePollsScreen = lazy(() => import('../app/modulos/screens/browsePolls/browsePolls'));

export type AppStackParamList = {
  Home: undefined;
  CreatePoll: undefined;
  BrowsePoll: undefined;
  PollInterface: undefined;
  PollResults: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

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
      <Stack.Screen name="CreatePoll" component={CreatePollScreen} />
      <Stack.Screen name="PollInterface" component={PollInterfaceScreen} />
      <Stack.Screen name="PollResults" component={PollResultsScreen} />
      <Stack.Screen name="BrowsePoll" component={BrowsePollsScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
