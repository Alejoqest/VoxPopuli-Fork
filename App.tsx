import React from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoginScreen from "./app/modulos/auth/login/login";
import RegisterScreen from "./app/modulos/auth/register/register";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import HomeScreen from "./app/modulos/screens/home/home";
import CreatePollScreen from "./app/modulos/screens/createPoll/createPoll";
import Header from "./app/modulos/Components/header/header";
import { es, registerTranslation } from "react-native-paper-dates";
import PollInterfaceScreen from "./app/modulos/screens/pollInterface/pollInterface";
import PollResultsScreen from "./app/modulos/screens/pollResults/pollResults";
import BrowsePollsScreen from "./app/modulos/screens/browsePolls/browsePolls";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";
import * as SystemUI from "expo-system-ui";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

enableScreens();
SystemUI.setBackgroundColorAsync("transparent");

registerTranslation("es", es);

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CreatePoll: undefined;
  BrowsePoll: undefined;
  PollInterface: undefined;
  PollResults: undefined;
  RegistroPropietario: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppContent() {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("black");
    NavigationBar.setButtonStyleAsync("light");

    // Verificar autenticación al iniciar la app
    const checkAuth = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        const username = await AsyncStorage.getItem("username");

        if (email && username) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setInitialRoute("Login");
      }
    };

    checkAuth();
  }, []);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (initialRoute === null) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider theme={MD3DarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" backgroundColor={"black"} />
          <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator
              screenOptions={{
                headerShown: true,
                headerTitleAlign: "center",
                header: (props) => <Header {...props} />,
              }}
              initialRouteName={initialRoute}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="CreatePoll" component={CreatePollScreen} />
              <Stack.Screen
                name="PollInterface"
                component={PollInterfaceScreen}
              />
              <Stack.Screen name="PollResults" component={PollResultsScreen} />
              <Stack.Screen name="BrowsePoll" component={BrowsePollsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </PaperProvider>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
