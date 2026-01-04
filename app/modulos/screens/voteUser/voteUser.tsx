import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { AppStackParamList } from "../../../../navigation/appStack";
import { RouteProp } from "@react-navigation/native";
import { VoteResult, VoteUser } from "../../models/Vote";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import { ScrollView, StyleSheet, View } from "react-native";
import { profileService } from "../../../../backend/services/profileService";
import { voteService } from "../../../../backend/services/voteService";
import Loading from "../../components/loading/loading";
import { Divider, IconButton, List, Surface, Text } from "react-native-paper";
import AvatarIcon from "../../components/avatarIcon/avatarIcon";
import { Colors } from "../../../constants/colors";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "PollResults"
>;

type props = {
  route: RouteProp<AppStackParamList, "VoteUser">;
};

const VoteUserScreen = ({ route }: props) => {
  const optionId = route.params.id;
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
          {
            //<Surface style={styles.surface}>
          }
          <List.Section style={{ margin: 0 }}>
            <List.Subheader variant="titleSmall">
              Votos totales: {vote.numVotes}
            </List.Subheader>
            {profiles.map((v, i) => {
              return (
                //<>
                <List.Item
                  key={v.profile?.id || i}
                  title={v.profile?.username || "Desconocido"}
                  left={() => <AvatarIcon size={45} profile={v.profile}/>}
                  right={() => <IconButton icon="chevron-right"/>}
                  titleNumberOfLines={1}
                  style={{
                    padding: 8,
                  }}
                />
                /*{profiles.length - 1 != i && (
                    <Divider 
                    style={{ marginVertical: 8, padding: 1 }} />
                  )}
                </>*/
              );
            })}
          </List.Section>
          {
            //</Surface>
          }
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default VoteUserScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: { marginTop: 24, marginBottom: 16, fontWeight: "bold" },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
});
