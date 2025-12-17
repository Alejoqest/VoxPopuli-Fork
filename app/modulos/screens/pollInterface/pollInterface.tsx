import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Icon,
  MD3DarkTheme,
  RadioButton,
  Surface,
  Text,
} from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import AppModal from "../../components/modal/modal";
import GradientBackground from "../../components/gradientBackground/gradientBackground";
import { AppStackParamList } from "../../../../navigation/appStack";
import { Option } from "../../models/Options";
import { Poll } from "../../models/Polls";
import { pollService } from "../../../../backend/services/pollService";
import { voteService } from "../../../../backend/services/voteService";
import { Vote } from "../../models/Vote";
import AvatarIcon from "../../components/avatarIcon/avatarIcon";
import Loading from "../../components/loading/loading";
import PollCardState from "../../components/pollState/pollState";

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "PollInterface"
>;

type props = {
  route: RouteProp<AppStackParamList, "PollInterface">;
};

type RemainingTime = {
  hours: number;
  minutes: number;
};

const PollInterfaceScreen = ({ route }: props) => {
  const navigation = useNavigation<NavigationProp>();
  const pollId = route.params.id;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [remainingTime, setRemainingTime] = useState<RemainingTime>({
    hours: 0,
    minutes: 0,
  });
  const [checked, setChecked] = useState<string>("");
  const [voteDisabled, setVoteDisabled] = useState(false);
  const [votingVisible, setVotingVisible] = useState(false);
  const [error, setError] = useState(false);

  const fetchPollData = useCallback(async () => {
    try {
      const data = await pollService.getPollById(pollId);

      const options = await pollService.getOptionsByPoll(pollId);

      const vote = await voteService.getVote(pollId);

      if (data.status == "closed" || data.status == "waiting") {
        setVoteDisabled(true);
      }
      if (vote) {
        const votedOption = options?.find((opt) => opt.id === vote.option_id);
        setVoteDisabled(true);
        setChecked(String(votedOption!.option_order));
      }

      setOptions(options);
      setPoll(data);
    } catch (err) {
      console.error("Error general:", err);
    }
  }, []);

  const updateRemainingTime = useCallback(() => {
    if (!poll) return;
    const now = new Date();
    const diffMs = new Date(poll.end_time).getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setRemainingTime({ hours, minutes });
  }, [poll]);

  useEffect(() => {
    fetchPollData();
  }, [fetchPollData]);
  useEffect(() => {
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [updateRemainingTime]);

  // 🔹 Verificar si ya votó (doble verificación)
  // 🔹 Encontrar opción seleccionada
  // 🔹 Insertar voto en el backend
  const handleVoting = async () => {
    setVotingVisible(false);
    if (!checked) {
      setError(true);
      return;
    }
    setError(false);

    try {
      const votedOption = options!.find(
        (opt) => String(opt.option_order) === checked
      );

      const vote: Vote = {
        poll_id: poll!.id,
        option_id: votedOption!.id!,
      };

      await voteService.insertVote(vote);

      setVoteDisabled(true);

      //console.log("Voto registrado correctamente");
    } catch (err) {
      console.error("Error guardando voto:", err);
      // Si falla, revertir el caché y el estado
      setVoteDisabled(false);
    }
  };

  if (!poll) return <Loading />;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <View style={styles.titleContainer}>
            <Text variant="headlineLarge" style={styles.title}>
              {poll.title}
            </Text>
            <PollCardState status={poll.status} />
          </View>

          <View style={styles.creatorContainer}>
            <AvatarIcon size={32} profile={poll.profile} />
            <Text variant="bodyMedium" style={styles.creator}>
              Creado por {poll.profile?.username || "Desconocido"}
            </Text>
          </View>

          <Surface
            elevation={1}
            style={[styles.surface, styles.descriptionSurface]}
          >
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Descripción
            </Text>
            <Text variant="bodyLarge" style={styles.descriptionText}>
              {poll.description}
            </Text>
          </Surface>

          <Surface elevation={1} style={[styles.surface, styles.textSurface]}>
            <Text variant="bodyMedium">
              <Icon
                source="calendar-start-outline"
                color={MD3DarkTheme.colors.primary}
                size={16}
              />{" "}
              {poll.status == "waiting" ? "Inicia en:" : "Iniciado:"}{" "}
              {new Date(poll.start_time).toLocaleDateString("es")}
            </Text>
            {remainingTime && (
              <Text variant="bodyMedium">
                <Icon
                  source="timer-outline"
                  color={MD3DarkTheme.colors.primary}
                  size={16}
                />{" "}
                {poll.status != "closed"
                  ? `${remainingTime.hours}h ${remainingTime.minutes} restantes`
                  : `Terminado en ${new Date(poll.end_time).toLocaleDateString(
                      "es"
                    )}`}
              </Text>
            )}
          </Surface>

          <Text variant="titleMedium" style={styles.optionsLabel}>
            Opciones
          </Text>

          <RadioButton.Group onValueChange={setChecked} value={checked}>
            {options.map((opt) => (
              <Surface key={opt.id} style={styles.surface}>
                <RadioButton.Item
                  label={opt.option_text}
                  value={String(opt.option_order)}
                  disabled={voteDisabled}
                />
              </Surface>
            ))}
          </RadioButton.Group>

          <HelperText type="error" visible={error}>
            Debes elegir una opción para poder votar.
          </HelperText>

          <Button
            mode="contained"
            disabled={voteDisabled}
            onPress={() => setVotingVisible(true)}
            style={styles.button}
          >
            Enviar voto
          </Button>

          <Button
            mode="elevated"
            style={styles.button}
            disabled={poll.status == "waiting"}
            onPress={() => navigation.navigate("PollResults", { id: poll.id })}
          >
            Mirar resultados
          </Button>
        </View>

        <AppModal
          visible={votingVisible}
          dismissable={false}
          onDismiss={() => setVotingVisible(false)}
          title="Confirmar voto"
          body="No podrás revertir tu voto."
          icon="send-lock"
        >
          <View style={styles.modalButtons}>
            <Button
              mode="elevated"
              onPress={() => setVotingVisible(false)}
              style={styles.inputHalf}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleVoting}
              style={styles.inputHalf}
            >
              Confirmar
            </Button>
          </View>
        </AppModal>
      </ScrollView>
    </GradientBackground>
  );
};

export default PollInterfaceScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  form: { flex: 1, width: "100%", paddingHorizontal: 16 },
  title: { marginTop: 24, marginBottom: 16, fontWeight: "bold" },
  text: { marginBottom: 16 },
  button: { width: "100%", marginBottom: 16 },
  titleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  creator: { marginLeft: 10, flex: 1 },
  textSurface: { flexDirection: "row", alignItems: "center", gap: 8 },
  descriptionSurface: { flexDirection: "column", paddingVertical: 16 },
  sectionLabel: {
    marginBottom: 8,
    color: MD3DarkTheme.colors.primary,
    fontWeight: "600",
  },
  descriptionText: { lineHeight: 22 },
  optionsLabel: { marginBottom: 12, marginTop: 4, fontWeight: "600" },
  inputHalf: { width: "48%" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
