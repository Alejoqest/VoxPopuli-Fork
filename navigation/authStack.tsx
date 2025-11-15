import React, { lazy } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const LoginScreen = lazy(() => import("../app/modulos/auth/login/login"));
const RegisterScreen = lazy(
  () => import("../app/modulos/auth/register/register")
);

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"Login"}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
