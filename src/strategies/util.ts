import { myAdventures } from "kolmafia";
import { $familiar, get, withProperties } from "libram";
import { cliExecuteThrow } from "../lib";
import { areOrgansFull, isOverdrunk, isStooperDrunk } from "../organs";
import { caldera, stooper } from "./common";
import { Strategy } from "./strategy";

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getScriptName(command: string): string {
  return capitalize(command.split(" ")[0]);
}

export function createNoBarfStrategy(command: string, overdrunk = false): Strategy {
  const scriptName = getScriptName(command);

  return {
    name: scriptName,
    tasks: (ascend: boolean) => [
      {
        name: "Garbo Nobarf",
        completed: () => (get("_garboCompleted", "") !== "" && areOrgansFull()) || isStooperDrunk(),
        do: () => cliExecuteThrow(`garbo nobarf ${ascend ? "ascend" : ""}`),
        limit: { tries: 1 },
        tracking: "Garbo",
      },
      {
        name: scriptName,
        completed: () => myAdventures() === 0 || isStooperDrunk(),
        do: () => cliExecuteThrow(command),
        limit: { tries: 1 },
        tracking: scriptName,
      },
      stooper(),
      {
        name: "Overdrink",
        completed: () => isOverdrunk(),
        do: () =>
          withProperties({ spiceMelangeUsed: true, currentMojoFilters: 3 }, () =>
            cliExecuteThrow(`CONSUME NIGHTCAP ${ascend ? "NOMEAT" : ""}`)
          ),
        outfit: { familiar: $familiar`Stooper` },
        limit: { tries: 1 },
      },
      ...(ascend
        ? [
            caldera(),
            {
              name: "Overdrunk",
              ready: () => isOverdrunk(),
              completed: () => myAdventures() === 0,
              do: () => cliExecuteThrow(overdrunk ? command : "garbo ascend"),
              limit: { tries: 1 },
              tracking: scriptName,
            },
          ]
        : []),
    ],
  };
}
