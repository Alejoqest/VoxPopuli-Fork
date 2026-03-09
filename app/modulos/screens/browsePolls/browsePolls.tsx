import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Divider, FAB, Searchbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import BrowsePollsView from "../../components/browsePollsView/browsePollsView";
import { AppStackParamList } from "../../../../navigation/appStack";
import { Poll } from "../../models/Polls";
import {
  pollService,
  searchQuery,
} from "../../../../backend/services/pollService";
import OptionSearch from "../../components/optionSearch/optionSearch";
import {
  orderContent,
  stateContent,
} from "../../../constants/optionsSearchContent";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "BrowsePoll"
>;

const BrowsePollsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [polls, setPolls] = useState<Poll[] | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchOrder, setSearchOrder] = useState<string>("");
  const [count, setCount] = useState<number>();
  const [preSearch, setPreSearch] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    const subscribe = async () => {
      unsubscribe = await pollService.onPollUpdate(async () => {
        changeSearch();
      });
    };
    subscribe();
    changeSearch();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    changeSearch();
  }, [searchStatus, searchOrder]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const getMorePolls = async () => {
    if (!polls || count == polls!.length) return;
    setLoadingMore(true);
    const lastValue = polls[polls!.length - 1]!.created_at;
    const order = searchOrder ? true : false;
    const query: searchQuery = {
      text: preSearch,
      state: searchStatus,
      order: order,
      cursor: lastValue,
    };
    try {
      const { data } = await pollService.getPolls(query);
      const newPolls = polls.concat(data);
      setPolls(newPolls);
      setLoadingMore(false);
    } catch (err) {
      console.log(err);
    }
  };

  const changeSearch = async () => {
    setCount(undefined);
    setPolls(undefined);
    setLoadingMore(false);
    const text = search.toLowerCase();
    const order = searchOrder ? true : false;
    const query: searchQuery = {
      text: text,
      state: searchStatus,
      order: order,
    };
    try {
      const { data, count } = await pollService.getPolls(query);
      setCount(count || 0);
      setPolls(data);
      setPreSearch(text);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.form}>
        <Text variant="displayMedium" style={styles.title}>
          Explorar Encuestas
        </Text>

        <Searchbar
          placeholder="Busca encuesta por tema..."
          onChangeText={setSearch}
          value={search}
          onIconPress={changeSearch}
          style={styles.text}
        />

        <ScrollView horizontal style={styles.horizontalScroll}>
          <OptionSearch
            chips={stateContent}
            value={searchStatus}
            setValue={setSearchStatus}
          />
          <OptionSearch
            chips={orderContent}
            value={searchOrder}
            setValue={setSearchOrder}
          />
        </ScrollView>

        <Divider style={styles.text} />

        <ScrollView
          contentContainerStyle={styles.container}
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <BrowsePollsView
            type="browse"
            polls={polls}
            navigation={navigation}
          />
          {count != polls?.length && (
            <Button
              mode="elevated"
              icon="plus-circle-outline"
              loading={loadingMore}
              disabled={loadingMore}
              style={{ marginBottom: 16 }}
              onPress={getMorePolls}
            >
              Cargar Más
            </Button>
          )}
        </ScrollView>

        <FAB
          icon="plus"
          label="Crear nueva encuesta"
          mode="elevated"
          style={styles.fab}
          onPress={() => navigation.navigate("CreatePoll")}
        />
      </View>
    </GradientBackground>
  );
};

export default BrowsePollsScreen;

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
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginBottom: 16,
  },
  horizontalScroll: {
    marginBottom: 4,
    paddingVertical: 8,
    maxHeight: 50,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
