import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { RootStackParamList } from "../../../../App";
import { Poll } from "../browsePolls/browsePolls";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import { supabase } from "../../../../backend/server/supabase";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@supabase/supabase-js";
import { authService } from "../../../../backend/services/authService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type Profile = {
  id: string;
  username: string;
  email: string;
  color: string;
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const session = await authService.getSession();
      setUser(session?.user ?? null);
    };
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await authService.logoutUser();
    navigation.navigate("Login");
  };

  if (loading || !user || !profile) {
    return (
      <GradientBackground>
        <View style={styles.center}>
          <Text>Cargando usuario...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.view}>
        <View style={styles.center}>
          <Avatar.Text
            size={120}
            label={profile.username.slice(0, 1)}
            style={{ marginTop: 32, marginBottom: 16, backgroundColor: profile.color }}
            //={profile.color}
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
