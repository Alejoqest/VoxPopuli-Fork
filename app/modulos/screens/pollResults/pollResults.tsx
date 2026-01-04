import React, { useEffect, useState, useRef, useCallback } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import {
  Divider,
  Text,
  SegmentedButtons,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import BarChart from "./components/barChart";
import PieChart from "./components/pieChart";
import { AppStackParamList } from "../../../../navigation/appStack";
import { voteService } from "../../../../backend/services/voteService";
import { pollService } from "../../../../backend/services/pollService";
import { PollResult } from "../../models/Polls";
import { VoteResult } from "../../models/Vote";
import { RouteProp, useNavigation } from "@react-navigation/native";
import Loading from "../../components/loading/loading";
import OptionCountView from "./components/optionCountView";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "PollResults"
>;

type props = {
  route: RouteProp<AppStackParamList, "PollResults">;
};

const PollResultsScreen = ({route} : props) => {
  const pollId = route.params.id;
  const navigation = useNavigation<NavigationProp>();
  const [poll, setPoll] = useState<PollResult | null>(null);
  const [votes, setVotes] = useState<VoteResult[]>([]);
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
      if (!poll) {
        const data = await pollService.getPollResult(pollId);
        setPoll(data);
      }

      const results = await voteService.getResults(pollId);
      const totalVotes = results.reduce((n, r) => n + r.numVotes, 0);

      setVotes(results);

      setPoll((prev) => (prev ? { ...prev, totalVotes } : prev));
    };

    load();

    // subscribe to realtime
    (async () => {
      unsubscribe = voteService.onVotesChange(pollId, () => {
        load();
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!poll || !votes) return <Loading/>;

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

          <OptionCountView votes={votes} navigation={navigation}/>
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
