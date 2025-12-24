import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Divider, FAB, Searchbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStackParamList } from "../../../../navigation/appStack";
import { Poll } from "../../models/Polls";
import {
  pollService,
  searchQuery,
} from "../../../../backend/services/pollService";
import OptionSearch from "../../Components/optionSearch/optionSearch";
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
  //const [username, setUsername] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchOrder, setSearchOrder] = useState<string>("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    /*const getUsername = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername);
        console.log("Usuario actual:", savedUsername);
      } else {
        console.warn("No se encontró el username en memoria");
      }
    };
    getUsername();*/
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

  const changeSearch = async () => {
    setPolls(undefined);

    const text = search.toLowerCase();

    const order = searchOrder ? true : false;

    const query: searchQuery = {
      text: text,
      state: searchStatus,
      order: order,
    };

    try {
      const data = await pollService.getPolls(query);
      setPolls(data);
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

        <ScrollView
          horizontal
          style={{ marginBottom: 4, paddingVertical: 8, maxHeight: 50 }}
        >
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
        </ScrollView>

        <FAB
          icon="plus"
          label="Crear nueva encuesta"
          mode="elevated"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
          }}
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
});
