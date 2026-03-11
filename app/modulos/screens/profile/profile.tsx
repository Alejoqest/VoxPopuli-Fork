import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar, Divider } from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import BrowsePollsView from "../../components/browsePollsView/browsePollsView";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import { authService } from "../../../../backend/services/authService";
import { AppStackParamList } from "../../../../navigation/appStack";
import { Profile } from "../../models/Profile";
import { profileService } from "../../../../backend/services/profileService";
import { pollService } from "../../../../backend/services/pollService";
import { Poll } from "../../models/Polls";
import Loading from "../../components/loading/loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<AppStackParamList, "Profile">;

type props = {
  route: RouteProp<AppStackParamList, "Profile">;
};

const LIMIT : boolean = true;

const ProfileScreen = ({ route }: props) => {
  const navigation = useNavigation<NavigationProp>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [polls, setPolls] = useState<Poll[] | undefined>(undefined);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;

      const profileId = !route.params ? userId : route.params!.id!;
      if (profileId == userId) setIsHome(true);

      const user = await profileService.getUser(profileId);
      setProfile(user);

      const { data, count } = await pollService.getPollsByUserId(
        profileId,
        LIMIT,
      );
      setPolls(data);
      setCount(count || 0);

      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!profile) return;

    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      unsubscribe = await pollService.onPollChange(profile.id, async () => {
        const { data, count } = await pollService.getPollsByUserId(
          profile.id,
          LIMIT,
        );
        setPolls(data);
        setCount(count || 0);
      });
    };

    subscribe();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [profile]);

  const handleLogout = async () => {
    await authService.logoutUser();
  };

  if (loading || !profile) return <Loading />;

  return (
    <GradientBackground>
      <View style={styles.view}>
        <View style={styles.center}>
          <Avatar.Text
            size={120}
            label={profile.username.slice(0, 1)}
            style={{
              marginTop: 32,
              marginBottom: 16,
              backgroundColor: profile.color,
            }}
          />
          <View style={{ marginBottom: 16 }}>
            <Text variant="headlineMedium" style={{ textAlign: "center" }}>
              {profile.username}
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>
              {profile.email}
            </Text>
          </View>
        </View>

        {isHome && (
          <>
            <Button
              mode="contained"
              icon="plus-circle-outline"
              style={{ marginBottom: 16 }}
              onPress={() => navigation.navigate("CreatePoll")}
            >
              Crear votación
            </Button>

            <Button
              mode="elevated"
              icon="chart-box-outline"
              style={{ marginBottom: 16 }}
              onPress={() => navigation.navigate("BrowsePoll")}
            >
              Explorar encuestas
            </Button>
          </>
        )}

        <Text
          variant="headlineSmall"
          style={[styles.margin, { textAlign: "center" }]}
        >
          Mis Encuestas
        </Text>

        <Divider style={styles.margin} />
        <ScrollView style={styles.container}>
          <BrowsePollsView type="user" polls={polls} navigation={navigation} />
          {count > 5 && (
            <Button mode="elevated" style={{ marginBottom: 16 }}>
              Ver más
            </Button>
          )}
        </ScrollView>
        <Divider style={styles.margin} />

        <Button
          mode="outlined"
          icon="logout"
          style={{ marginVertical: 24 }}
          onPress={handleLogout}
        >
          Cerrar sesión
        </Button>
      </View>
    </GradientBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
  },
  view: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  margin: {
    marginBottom: 16,
  },
});
