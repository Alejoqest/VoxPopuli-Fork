import React from "react";
import { Poll, Vote } from "../pollResults";
import { View } from "react-native";
import { ProgressBar, Text } from "react-native-paper";
import { Colors } from "../../../../constants/colors";

type props = {
  votes: Vote[];
  poll: Poll;
};

const barChart = ({ votes, poll }: props) => {
  return (
    <>
      {votes.map((v, i) => {
        return (
          <View
            key={v.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text variant="titleSmall" style={{ width: 60 }}>{v.optionName}</Text>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <ProgressBar
                progress={v.percentageVotes / 100}
                color={Colors[i]}
                style={{ height: 10, borderRadius: 5 }}
              />
            </View>
            <Text variant="titleSmall">{v.percentageVotes}%</Text>
          </View>
        );
      })}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text variant="titleMedium">Votos Totales:</Text>
        <Text variant="titleMedium">{poll.totalVotes}</Text>
      </View>
    </>
  );
};

export default barChart;
