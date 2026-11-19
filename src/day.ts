import { print, visitUrl, wait } from "kolmafia";
import { get } from "libram";
import { args } from "./args";
import { LoopQuest } from "./engine/engine";
import { isHalloween } from "./lib";
import { aftercoreQuest } from "./paths/aftercore";
import { casualQuest } from "./paths/casual";
import { csQuest } from "./paths/cs";
import { postQuest } from "./paths/post";
import { robotQuest } from "./paths/robot";
import { smolQuest } from "./paths/smol";
import { chrono } from "./strategies/chrono";
import { crimbo } from "./strategies/crimbo";
import { freecandy } from "./strategies/freecandy";
import { garbo } from "./strategies/garbo";
import { Strategy } from "./strategies/strategy";

export type Day = {
  strategy: Strategy;
  path: string;
  quests: LoopQuest[];
};

export function planDay(): Day {
  const strategy = resolveStrategy(args.major.strategy);
  const path = args.major.path;
  return { strategy, path, quests: questsFor(path, strategy) };
}

type GameState = { timeTowerAvailable: boolean; halloween: boolean };

function chooseStrategy(requested: string, state: GameState): Strategy {
  switch (requested) {
    case "auto":
      if (state.timeTowerAvailable) return chrono;
      if (state.halloween) return freecandy;
      return garbo;
    case "garbo":
      return garbo;
    case "freecandy":
      return freecandy;
    case "chrono":
      return chrono;
    case "crimbo":
      return crimbo;
    default:
      throw `Unknown strategy name ${requested}`;
  }
}

function resolveStrategy(requested: string): Strategy {
  visitUrl("town.php"); // Check if time tower is available
  const strategy = chooseStrategy(requested, {
    timeTowerAvailable: get("timeTowerAvailable"),
    halloween: isHalloween(),
  });
  if (requested === "auto") {
    print(`Auto-selecting ${strategy.name} strategy`, "blue");
    wait(5);
  }
  return strategy;
}

function questsFor(path: string, strategy: Strategy): LoopQuest[] {
  switch (path) {
    case "cs":
      return [aftercoreQuest(strategy), csQuest(), postQuest(strategy)];
    case "casual":
      return [aftercoreQuest(strategy), casualQuest(), postQuest(strategy)];
    case "smol":
      return [aftercoreQuest(strategy), smolQuest(), postQuest(strategy)];
    case "robot":
      return [aftercoreQuest(strategy), robotQuest(), postQuest(strategy)];
    case "custom":
      return [aftercoreQuest(strategy)];
    case "none":
      return [postQuest(strategy)];
    default:
      throw `Unknown run type ${path}`;
  }
}
