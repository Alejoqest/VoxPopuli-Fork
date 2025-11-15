import React, { useState } from "react";
import { View, Alert } from "react-native";
import {
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { supabase } from "../../../../backend/server/supabase";
import Logo from "../../Components/logo/logo";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 👈 IMPORTANTE
import { authService } from "../../../../backend/services/authService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

type Errors = {
  usernameEmpty: boolean;
  passwordEmpty: boolean;
  credentialsFailed: boolean;
};

const initialErrors: Errors = {
  usernameEmpty: false,
  passwordEmpty: false,
  credentialsFailed: false,
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const handleLogin = async () => {
    setIsProcessing(true);
    setErrors(initialErrors);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }

    const res = await authService.login(usernameOrEmail, password);

    if (res) {
      Alert.alert(res);
      console.log(res);
      setErrors({ ...initialErrors, credentialsFailed: true });
    }

    if (!res) {
      Alert.alert("✅ Sesión iniciada correctamente");
      navigation.navigate("Home");
    }
    setIsProcessing(false);
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <View style={{ marginBottom: 32 }}>
          <Logo />
        </View>

        {/* Usuario o Email */}
        <View style={{ width: "80%", marginBottom: 12 }}>
          <TextInput
            label="Usuario o Email"
            mode="outlined"
            placeholder="Ingresa tu nombre de usuario o email"
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            autoCapitalize="none"
            error={errors.usernameEmpty || errors.credentialsFailed}
          />
          {errors.usernameEmpty && (
            <HelperText type="error" visible>
              Introduzca su usuario o email
            </HelperText>
          )}
        </View>

        {/* Contraseña */}
        <View style={{ width: "80%", marginBottom: 12 }}>
          <TextInput
            label="Contraseña"
            mode="outlined"
            placeholder="Contraseña"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            autoCapitalize="none"
            error={errors.passwordEmpty || errors.credentialsFailed}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye" : "eye-off"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.passwordEmpty && (
            <HelperText type="error" visible>
              Introduzca su contraseña
            </HelperText>
          )}
          {errors.credentialsFailed && (
            <HelperText type="error" visible>
              Credenciales incorrectas o cuenta no verificada
            </HelperText>
          )}
        </View>

        {/* Botón Ingresar */}
        <Button
          mode="contained"
          style={{ width: "80%", marginTop: 12, marginBottom: 16 }}
          onPress={handleLogin}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator animating color="white" />
          ) : (
            "Ingresar"
          )}
        </Button>

        <Button mode="text" onPress={() => navigation.navigate("Register")}>
          ¿No tienes cuenta? Regístrate
        </Button>
      </View>
    </GradientBackground>
  );
};

export default LoginScreen;
