import React from "react";
import { Vote, Poll } from "../pollResults";
import PieChart, { Slice } from "react-native-pie-chart";
import { Colors } from "../../../../constants/colors";
import { View } from "react-native";
import { Text } from "react-native-paper";

type props = {
  votes: Vote[];
  poll: Poll;
};

const pieChart = ({ votes, poll }: props) => {
  const convertSlices = (votes: Vote[]): Slice[] => {
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
      <PieChart
        widthAndHeight={150}
        series={convertSlices(votes)}
        cover={0.3}
        padAngle={0.05}
      />
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
                {v.optionName} ({v.percentageVotes}%)
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
