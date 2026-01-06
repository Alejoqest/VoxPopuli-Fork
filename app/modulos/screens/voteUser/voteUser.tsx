import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { AppStackParamList } from "../../../../navigation/appStack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { VoteResult, VoteUser } from "../../models/Vote";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import { ScrollView, StyleSheet, View } from "react-native";
import { profileService } from "../../../../backend/services/profileService";
import { voteService } from "../../../../backend/services/voteService";
import Loading from "../../components/loading/loading";
import { Text } from "react-native-paper";
import { Colors } from "../../../constants/colors";
import UserList from "./components/userList";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "PollResults"
>;

type props = {
  route: RouteProp<AppStackParamList, "VoteUser">;
};

const VoteUserScreen = ({ route }: props) => {
  const optionId = route.params.id;
  const navigation = useNavigation<NavigationProp>();
  const [vote, setVote] = useState<VoteResult>();
  const [profiles, setProfiles] = useState<VoteUser[]>();

  useEffect(() => {
    const getInfo = async () => {
      const info = await voteService.getVoteByOption(optionId);
      const users = await profileService.getUsersByVote(optionId);
      setVote(info);
      setProfiles(users);
    };
    getInfo();
  }, []);

  if (!vote || !profiles) return <Loading />;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <View style={styles.form}>
          <Text variant="titleMedium">Votaron por</Text>
          <Text
            style={[{ color: Colors[vote.optionOrder - 1] }, styles.title]}
            variant="headlineLarge"
          >
            {vote.optionText}
          </Text>
          <UserList vote={vote} profiles={profiles} navigation={navigation} />
          {
            //<Surface style={styles.surface}>
            //</Surface>
          }
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default VoteUserScreen;

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
