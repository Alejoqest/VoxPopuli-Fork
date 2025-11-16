import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../../Components/logo/logo";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import { authService } from "../../../../backend/services/authService";
import { AuthStackParamList } from "../../../../navigation/authStack";
import AuthError from "../../Components/authError/authError";
import PasswordInput from "../../Components/passwordInput/passwordInput";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

type Errors = {
  usernameEmpty: boolean;
  passwordEmpty: boolean;
};

const initialErrors: Errors = {
  usernameEmpty: false,
  passwordEmpty: false,
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [authError, setAuthError] = useState<string | undefined>(undefined);

  const handleLogin = async () => {
    setLoading(true);
    setErrors(initialErrors);
    setAuthError(undefined);

    if (checkErrors()) {
      setLoading(false);
      return;
    }

    const res = await authService.login(usernameOrEmail, password);

    if (res) setAuthError(res);

    setLoading(false);
  };

  const checkErrors = (): boolean => {
    const newErrors = { ...initialErrors };

    if (!usernameOrEmail) newErrors.usernameEmpty = true;
    if (!password) newErrors.passwordEmpty = true;

    setErrors(newErrors);
    return Object.values(newErrors).includes(true);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={{ marginBottom: 32 }}>
          <Logo />
        </View>

        {/* Usuario o Email */}
        <View style={styles.input}>
          <TextInput
            label="Usuario o Email"
            mode="outlined"
            placeholder="Ingresa tu nombre de usuario o email"
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            autoCapitalize="none"
            error={errors.usernameEmpty || !!authError}
          />
          {errors.usernameEmpty && (
            <HelperText type="error" visible>
              Introduzca su usuario o email
            </HelperText>
          )}
        </View>

        {/* Contraseña */}
        <View style={styles.input}>
          <PasswordInput
            value={password}
            setValue={setPassword}
            error={errors.passwordEmpty || !!authError}
          />
          {errors.passwordEmpty && (
            <HelperText type="error" visible>
              Introduzca su contraseña
            </HelperText>
          )}
        </View>

        <AuthError error={authError} setError={setAuthError}/>

        {/* Botón Ingresar */}
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        >
          Ingresar
        </Button>

        <Button mode="text" onPress={() => navigation.navigate("Register")}>
          ¿No tienes cuenta? Regístrate
        </Button>
      </View>
    </GradientBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: { width: "80%", marginBottom: 12 },
  button: { width: "80%", marginVertical: 12 },
});
