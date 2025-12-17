import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Modal, Portal, Text, useTheme } from "react-native-paper";

type Props = {
  children: ReactElement;
  visible: boolean;
  title: string;
  body: string;
  icon?: string;
  dismissable: boolean;
  onDismiss: () => void;
};

const AppModal = ({
  children,
  visible,
  title,
  body,
  icon,
  dismissable = false,
  onDismiss,
}: Props) => {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={dismissable}
        onDismiss={onDismiss}
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: colors.background,
            padding: 25,
            borderRadius: 15,
          }}
        >
          {icon && (
            <View style={styles.iconContainer}>
              <View>
                <Icon source={icon} size={75} color={colors.primary} />
              </View>
            </View>
          )}

          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.text}>{body}</Text>
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  iconContainer: { justifyContent: "center", alignItems: "center", marginBottom: 0},
  title: { marginTop: 16, marginBottom: 16, fontWeight: "bold" },
  text: { marginBottom: 16 },
});
