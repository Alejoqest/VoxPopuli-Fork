import React, { useEffect, useState, useRef, useCallback } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import {
  Divider,
  IconButton,
  Surface,
  Text,
  SegmentedButtons,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import BarChart from "./components/barChart";
import PieChart from "./components/pieChart";
import { supabase } from "../../../../backend/server/supabase";
import { Colors } from "../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStackParamList } from "../../../../navigation/appStack";
import { voteService } from "../../../../backend/services/voteService";
import { pollService } from "../../../../backend/services/pollService";
import { PollResult } from "../../models/Polls";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "PollResults"
>;

export type Vote = {
  id: number;
  optionName: string;
  optionOrder: number;
  numVotes: number;
  percentageVotes: number;
};

const PollResultsScreen = () => {
  const [poll, setPoll] = useState<PollResult | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [chart, setChart] = useState("bar");
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [chart]);

  useEffect(() => {
    let unsubscribe: null | (() => void) = null;

    const load = async () => {
      const storedPollId = await AsyncStorage.getItem("selectedPollId");
      if (!storedPollId) return;

      const pollId = parseInt(storedPollId);

      // fetch poll if missing
      if (!poll) {
        const data = await pollService.getPollResult(pollId);
        setPoll(data);
      }

      // fetch vote results
      const results = await voteService.getResults(pollId);
      const totalVotes = results.reduce((n, r) => n + r.numVotes, 0);

      setVotes(results);

      setPoll((prev) => (prev ? { ...prev, totalVotes } : prev));
    };

    load();

    // subscribe to realtime
    (async () => {
      const storedPollId = await AsyncStorage.getItem("selectedPollId");
      if (!storedPollId) return;

      const pollId = parseInt(storedPollId);

      unsubscribe = voteService.onVotesChange(pollId, () => {
        load(); // refresh when a vote changes
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const sum = (votes: any[]) => votes.reduce((acc, v) => acc + v.numVotes, 0);

  if (!poll) return <Text>Cargando resultados...</Text>;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <View style={styles.form}>
          <Text variant="displayMedium" style={styles.title}>
            {poll.title}
          </Text>
          <SegmentedButtons
            style={styles.text}
            value={chart}
            onValueChange={setChart}
            buttons={[
              { value: "bar", label: "Gráfico Barras" },
              { value: "percentage", label: "Gráfico Porcentajes" },
            ]}
          />
          <Animated.View style={[{ opacity }]}>
            {chart === "bar" ? (
              <BarChart votes={votes} poll={poll} />
            ) : (
              <PieChart votes={votes} poll={poll} />
            )}
          </Animated.View>

          <Divider style={styles.text} />

          <View style={styles.text}>
            {votes.map((v, i) => (
              <Surface
                key={v.id}
                style={[
                  styles.surface,
                  styles.textSuface,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconButton
                    icon="circle-outline"
                    containerColor={Colors[i]}
                  />
                  <Text variant="titleMedium">
                    {v.optionName + "\n"}
                    {v.numVotes} Votos
                  </Text>
                </View>
                <Text variant="titleMedium">{v.percentageVotes}%</Text>
              </Surface>
            ))}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default PollResultsScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: { marginTop: 16, marginBottom: 16 },
  text: { marginBottom: 16 },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 20,
    paddingLeft: 22,
  },
  textSuface: {
    padding: 12,
    paddingLeft: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
