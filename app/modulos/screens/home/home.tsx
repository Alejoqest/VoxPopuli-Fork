import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import BrowsePollsView from "../../components/browsePollsView/browsePollsView";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import { User } from "@supabase/supabase-js";
import { authService } from "../../../../backend/services/authService";
import { AppStackParamList } from "../../../../navigation/appStack";
import { Profile } from "../../models/Profile";
import { profileService } from "../../../../backend/services/profileService";
import { pollService } from "../../../../backend/services/pollService";
import { Poll } from "../../models/Polls";
import Loading from "../../components/loading/loading";

type NavigationProp = NativeStackNavigationProp<AppStackParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const session = await authService.getSession().then((s) => s?.user);
      setUser(session ?? null);
      if (session) {
        const data = await profileService.getUser(session.id);
        setProfile(data);
        setLoading(false);
        const poll = await pollService.getPollsByUserId(session.id);
        setPolls(poll);
      }
    };
    load();
  }, []);

  /*useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const data = await profileService.getUser(user.id);
      setProfile(data);
      setLoading(false);
      const poll = await pollService.getPollsByUserId(user.id);
      setPolls(poll);
    };
    loadProfile();
  }, [user]);*/

  const handleLogout = async () => {
    await authService.logoutUser();
  };

  if (loading || !user || !profile) return <Loading />;

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

        <Text
          variant="headlineSmall"
          style={[styles.margin, { textAlign: "center" }]}
        >
          Mis Encuestas
        </Text>

        <ScrollView style={styles.container}>
          <BrowsePollsView polls={polls} navigation={navigation} />
        </ScrollView>

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

export default HomeScreen;

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
