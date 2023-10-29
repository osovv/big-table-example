import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createArray = ({ min, max }: { min: number; max: number }) => {
  return Array.from(Array(max + 1 - min)).map(function (_, idx) {
    return idx + min;
  });
};
