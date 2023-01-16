import { getCurrentLeg, Leg, Quest } from "../engine/task";
import { breakfast, duffo, menagerie, pvp } from "./common";
import { Strategy } from "./strategies/strategy";

export function aftercoreQuest(strategy: Strategy): Quest {
  return {
    name: "Aftercore",
    completed: () => getCurrentLeg() > Leg.Aftercore,
    tasks: [
      ...breakfast(),
      ...duffo(),
      ...menagerie(),
      ...strategy.tasks(true, ["Breakfast"]),
      ...pvp([]),
    ],
  };
}
