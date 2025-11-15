import React from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { es, registerTranslation } from "react-native-paper-dates";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import RootNavigator from "./navigation/rootNavigator";

enableScreens();
SystemUI.setBackgroundColorAsync("transparent");

registerTranslation("es", es);

export function AppContent() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("black");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider theme={MD3DarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" backgroundColor={"black"} />
          <NavigationContainer theme={DarkTheme}>
            <RootNavigator />
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
