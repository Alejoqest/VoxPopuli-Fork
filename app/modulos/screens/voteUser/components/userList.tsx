import React from "react";
import { VoteResult, VoteUser } from "../../../models/Vote";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../../../../navigation/appStack";
import { Divider, List } from "react-native-paper";
import { StyleSheet } from "react-native";
import UserItem from "./userItem";

type Props = {
  vote: VoteResult;
  profiles: VoteUser[];
  navigation: NavigationProp<AppStackParamList>;
};

const userList = ({ vote, profiles, navigation }: Props) => {
  return (
    <List.Section style={{ margin: 0 }}>
      <List.Subheader variant="titleSmall">
        Votos totales: {vote.numVotes}
      </List.Subheader>
      <Divider style={styles.text} />
      {profiles.length == 0 ? (
        <List.Item title="No hay votos" titleStyle={{ textAlign: "center" }} />
      ) : (
        profiles.map((v, i) => {
          return (
            //<>
            <UserItem
              key={v.profile?.id || i}
              vote={v}
              navigation={navigation}
            />
            /*{profiles.length - 1 != i && (
                    <Divider 
                    style={{ marginVertical: 8, padding: 1 }} />
                  )}
                </>*/
          );
        })
      )}
    </List.Section>
  );
};

export default userList;

const styles = StyleSheet.create({
  text: { marginBottom: 16 },
});
