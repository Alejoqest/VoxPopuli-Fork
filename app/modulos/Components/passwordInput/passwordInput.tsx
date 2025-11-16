import React, { useState } from "react";
import { TextInput } from "react-native-paper";

type Props = {
  label?: string;
  placeHolder?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
};

const PasswordInput = ({ label, placeHolder, value, setValue, error }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <TextInput
        label={label || 'Contraseña'}
        mode="outlined"
        placeholder={placeHolder || 'Contraseña'}
        value={value}
        secureTextEntry={!showPassword}
        onChangeText={setValue}
        autoCapitalize="none"
        error={error}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
    </>
  );
};

export default PasswordInput;
