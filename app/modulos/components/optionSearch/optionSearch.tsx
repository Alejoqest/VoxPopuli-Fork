import React from "react";
import { Chip } from "react-native-paper";

type BtnChip = {
  optionValue: string;
  optionText: string;
};

type Props = {
  chips: BtnChip[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const optionSearch = ({ chips, value, setValue }: Props) => {
  return (
    <>
      {chips.map((v, i) => {
        return (
          <Chip
            key={i}
            mode="outlined"
            selected={v.optionValue == value}
            onPress={() => setValue(v.optionValue)}
            style={{ marginHorizontal: 8, minHeight: 32 }}
          >
            {v.optionText}
          </Chip>
        );
      })}
    </>
  );
};

export default optionSearch;
