import { type BigTableRow } from "./types";

export const makeRows = (len: number, startingIndex: number): BigTableRow[] => {
  return Array.from(Array(len), (_, i) => ({
    id: startingIndex + i,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  }));
};
