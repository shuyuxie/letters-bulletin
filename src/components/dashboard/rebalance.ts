"use server";
import { Letter } from "@/models/Letter";

export default async function rebalanceZ(letters: Letter[]) {
  const order = letters.toSorted((a, b) => a.coordinates.z - b.coordinates.z);
  const newLetters = letters.map((letter): Letter => {
    return {
      ...letter,
      coordinates: {
        ...letter.coordinates,
        z: order.findIndex((l) => l._id === letter._id),
      },
    };
  });
  return newLetters;
}
