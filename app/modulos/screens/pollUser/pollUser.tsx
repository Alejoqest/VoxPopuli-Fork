import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { AppStackParamList } from "../../../../navigation/appStack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import { ScrollView, StyleSheet, View } from "react-native";
import Loading from "../../components/loading/loading";
import { Text } from "react-native-paper";
import UserList from "./components/pollList";
import { Poll } from "../../models/Polls";
import { pollService } from "../../../../backend/services/pollService";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "PollUser"
>;

type props = {
  route: RouteProp<AppStackParamList, "PollUser">;
};

const PollUserScreen = ({ route }: props) => {
  const profileId = route.params.id;
  const navigation = useNavigation<NavigationProp>();
  const [polls, setPolls] = useState<Poll[]>();

  useEffect(() => {
    const getInfo = async () => {
      const { data } = await pollService.getPollsByUserId(profileId);
      setPolls(data);
    };
    getInfo();
  }, []);

  if (!polls) return <Loading />;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <View style={styles.form}>
          <Text variant="titleMedium">Encuentas</Text>
          <UserList polls={polls} navigation={navigation} />
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default PollUserScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 75,
  },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: { marginTop: 8, marginBottom: 16, fontWeight: "bold" },
  text: { marginBottom: 16 },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
});
