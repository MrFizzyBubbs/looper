import { myAdventures, myInebriety } from "kolmafia";
import { $familiar, get, withProperties, withProperty } from "libram";
import { canConsume, cliExecuteThrow, stooperInebrietyLimit } from "../lib";
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
        completed: () =>
          (get("_garboCompleted", "") !== "" && !canConsume()) ||
          myInebriety() >= stooperInebrietyLimit(),
        do: () => cliExecuteThrow(`garbo nobarf ${ascend ? "ascend" : ""}`),
        limit: { tries: 1 },
        tracking: "Garbo",
      },
      {
        name: scriptName,
        completed: () => myAdventures() === 0 || myInebriety() >= stooperInebrietyLimit(),
        do: () => cliExecuteThrow(command),
        limit: { tries: 1 },
        tracking: scriptName,
      },
      stooper(),
      {
        name: "Overdrink",
        completed: () => myInebriety() > stooperInebrietyLimit(),
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
              ready: () => myInebriety() > stooperInebrietyLimit(),
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
