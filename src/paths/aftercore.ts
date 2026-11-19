import { batfellow, breakfast, duffo, pullAll, pvp } from "./common";
import { ascendedToday } from "../lib";
import { LoopQuest } from "../engine/engine";
import { Strategy } from "../strategies/strategy";

export function aftercoreQuest(strategy: Strategy): LoopQuest {
  return {
    name: "Aftercore",
    completed: () => ascendedToday(),
    tasks: [
      pullAll(),
      ...breakfast(),
      ...duffo(),
      ...batfellow(),
      ...strategy.tasks(true),
      ...pvp(),
    ],
  };
}
