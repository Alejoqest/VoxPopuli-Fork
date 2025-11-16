import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import { authService } from "../../../../backend/services/authService";
import { AuthStackParamList } from "../../../../navigation/authStack";
import AuthError from "../../Components/authError/authError";
import PasswordInput from "../../Components/passwordInput/passwordInput";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

type errorsTypes = {
  notEmail: boolean;
  emailEmpty: boolean;
  usernameMax: boolean;
  usernameMin: boolean;
  usernameEmpty: boolean;
  usernameInvalid: boolean;
  passwordMin: boolean;
  passwordMax: boolean;
  passwordInvalid: boolean;
  passwordEmpty: boolean;
  passwordFailed: boolean;
};

const startErrors: errorsTypes = {
  notEmail: false,
  emailEmpty: false,
  usernameMax: false,
  usernameMin: false,
  usernameEmpty: false,
  usernameInvalid: false,
  passwordMin: false,
  passwordMax: false,
  passwordInvalid: false,
  passwordEmpty: false,
  passwordFailed: false,
};

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<errorsTypes>(startErrors);
  const [authError, setAuthError] = useState<string | undefined>(undefined);

  const checkErrors = (): boolean => {
    let newErrors = { ...startErrors };

    // 🔹 Email
    if (!email) newErrors.emailEmpty = true;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.notEmail = true;

    // 🔹 Username
    if (!username) newErrors.usernameEmpty = true;
    else {
      if (/[^a-zA-Z0-9_]/.test(username)) newErrors.usernameInvalid = true;
      if (username.length > 25) newErrors.usernameMax = true;
      if (username.length < 4) newErrors.usernameMin = true;
    }

    // 🔹 Password
    if (!password) newErrors.passwordEmpty = true;
    else {
      if (password.length > 32) newErrors.passwordMax = true;
      if (password.length < 8) newErrors.passwordMin = true;
      if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password))
        newErrors.passwordInvalid = true;
      if (password !== repeatPassword) newErrors.passwordFailed = true;
    }

    setErrors(newErrors);
    return Object.values(newErrors).includes(true);
  };

  const handleRegister = async () => {
    setLoading(true);
    setAuthError(undefined);

    if (checkErrors()) {
      setLoading(false);
      return;
    }

    const res = await authService.registerUser(email, password, username);

    if (res) setAuthError(res);
    setLoading(false);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
          Crear una cuenta
        </Text>

        {/* Nombre de Usuario */}
        <View style={styles.input}>
          <TextInput
            label="Nombre de Usuario"
            mode="outlined"
            placeholder="Nombre"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={
              errors.usernameEmpty ||
              errors.usernameInvalid ||
              errors.usernameMax ||
              errors.usernameMin
            }
          />
          {errors.usernameEmpty && (
            <HelperText type="error" visible>
              Introduzca su nombre de usuario
            </HelperText>
          )}
          {errors.usernameInvalid && (
            <HelperText type="error" visible>
              El nombre de usuario no puede tener caracteres especiales
            </HelperText>
          )}
          {errors.usernameMax && (
            <HelperText type="error" visible>
              El nombre de usuario es demasiado largo
            </HelperText>
          )}
          {errors.usernameMin && (
            <HelperText type="error" visible>
              El nombre de usuario debe ser más largo
            </HelperText>
          )}
        </View>

        {/* Email */}
        <View style={styles.input}>
          <TextInput
            label="Email"
            mode="outlined"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            error={errors.emailEmpty || errors.notEmail}
          />
          {errors.emailEmpty && (
            <HelperText type="error" visible>
              Introduzca su dirección de email
            </HelperText>
          )}
          {errors.notEmail && (
            <HelperText type="error" visible>
              No es un email válido
            </HelperText>
          )}
        </View>

        {/* Contraseña */}
        <View style={styles.input}>
          <PasswordInput
            value={password}
            setValue={setPassword}
            error={
              errors.passwordEmpty ||
              errors.passwordFailed ||
              errors.passwordInvalid ||
              errors.passwordMax ||
              errors.passwordMin
            }
          />
          {errors.passwordEmpty && (
            <HelperText type="error" visible>
              Introduzca su contraseña
            </HelperText>
          )}
          {errors.passwordMin && (
            <HelperText type="error" visible>
              La contraseña debe ser más larga
            </HelperText>
          )}
          {errors.passwordMax && (
            <HelperText type="error" visible>
              La contraseña es demasiado larga
            </HelperText>
          )}
          {errors.passwordInvalid && (
            <HelperText type="error" visible>
              La contraseña necesita un número y una letra mayúscula
            </HelperText>
          )}
        </View>

        {/* Repetir contraseña */}
        <View style={styles.input}>
          <PasswordInput
            label="Repita la contraseña"
            value={repeatPassword}
            setValue={setRepeatPassword}
            error={errors.passwordEmpty || errors.passwordFailed}
          />
          {errors.passwordFailed && (
            <HelperText type="error" visible>
              La contraseña no coincide
            </HelperText>
          )}
        </View>

        <AuthError error={authError} setError={setAuthError}/>

        {/* Botón Registrar */}
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator animating color="white" />
          ) : (
            "Registrar"
          )}
        </Button>

        <Button mode="text" onPress={() => navigation.navigate("Login")}>
          ¿Tienes una cuenta? Inicia Sesión
        </Button>
      </View>
    </GradientBackground>
  );
};

export default RegisterScreen;

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
