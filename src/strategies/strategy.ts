import { freecandy } from "./freecandy";
import { garbo } from "./garbo";
import { args } from "../args";
import { chrono } from "./chrono";
import { LoopTask } from "../engine/engine";
import { print, visitUrl, wait } from "kolmafia";
import { get } from "libram";
import { isHalloween } from "../lib";
import { crimbo } from "./crimbo";

export type Strategy = {
  name: string;
  tasks: (ascend: boolean) => LoopTask[];
};

let _strategy: Strategy | null = null;

export function setStrategy(): void {
  visitUrl("town.php"); // Check if time tower is available

  switch (args.major.strategy) {
    case "auto":
      if (get("timeTowerAvailable")) _strategy = chrono;
      else if (isHalloween()) _strategy = freecandy;
      else _strategy = garbo;

      print(`Auto-selecting ${_strategy.name} strategy`, "blue");
      wait(5);
      break;
    case "garbo":
      _strategy = garbo;
      break;
    case "freecandy":
      _strategy = freecandy;
      break;
    case "chrono":
      _strategy = chrono;
      break;
    case "crimbo":
      _strategy = crimbo;
      break;
    default:
      throw `Unknown strategy name ${args.major.strategy}`;
  }
}

export function getStrategy(): Strategy {
  if (_strategy === null) throw new Error("A strategy has not been set.");
  return _strategy;
}
