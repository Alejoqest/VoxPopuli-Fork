import React from "react";
import PieChart, { Slice } from "react-native-pie-chart";
import { Colors, ExtraColors } from "../../../../constants/colors";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { PollResult } from "../../../models/Polls";
import { VoteResult } from "../../../models/Vote";

type props = {
  votes: VoteResult[];
  poll: PollResult;
};

const pieChart = ({ votes, poll }: props) => {
  const convertSlices = (votes: VoteResult[]): Slice[] => {
    const series = votes.map((v, i) => {
      return {
        value: v.numVotes,
        color: Colors[i],
      };
    });
    return series;
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {poll.totalVotes == 0 ? (
        <PieChart
          widthAndHeight={150}
          series={[
            { value: 1, color: ExtraColors.empty },
            { value: 1, color: ExtraColors.empty },
          ]}
          cover={0.3}
        />
      ) : (
        <PieChart
          widthAndHeight={150}
          series={convertSlices(votes)}
          cover={0.3}
          padAngle={0.05}
        />
      )}
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          width: "70%",
        }}
      >
        {votes.map((v, i) => {
          return (
            <View
              key={v.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 4,
                width: "50%",
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: Colors[i],
                  marginRight: 8,
                }}
              />
              <Text variant="titleSmall">
                {v.optionText} ({v.percentageVotes}%)
              </Text>
            </View>
          );
        })}
        <View
          style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
        >
          <Text variant="titleMedium">Votos Totales: {poll.totalVotes}</Text>
        </View>
      </View>
    </View>
  );
};

export default pieChart;
