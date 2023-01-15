import { inebrietyLimit, myAdventures, myInebriety } from "kolmafia";
import { $familiar, get, withProperty } from "libram";
import { canConsume, cliExecuteThrow, stooperInebrietyLimit } from "../../lib";
import { caldera, stooper } from "./common";
import { Strategy } from "./strategy";

export function garbo(): Strategy {
  return {
    tasks: (ascend: boolean, after: string[]) => [
      {
        name: "Garbo",
        after: after,
        completed: () =>
          (get("_garboCompleted", "") !== "" && myAdventures() === 0 && !canConsume()) ||
          myInebriety() >= stooperInebrietyLimit(),
        do: () => cliExecuteThrow(`garbo yachtzeechain ${ascend ? "ascend" : ""}`),
        limit: { tries: 1 },
        tracking: "Garbo",
      },
      stooper([...after, "Garbo"]),
      {
        name: "Overdrink",
        after: [...after, "Stooper"],
        completed: () => myInebriety() > stooperInebrietyLimit(),
        do: () =>
          withProperty("spiceMelangeUsed", true, () =>
            cliExecuteThrow(`CONSUME NIGHTCAP ${ascend ? "VALUE 3250" : ""}`)
          ),
        outfit: { familiar: $familiar`Stooper` },
        limit: { tries: 1 },
      },
      ...(ascend
        ? [
            caldera([...after, "Overdrink"]),
            {
              name: "Overdrunk",
              after: [...after, "Overdrink"],
              ready: () => myInebriety() > inebrietyLimit(),
              completed: () => myAdventures() === 0,
              do: () => cliExecuteThrow("garbo ascend"),
              limit: { tries: 1 },
              tracking: "Garbo",
            },
          ]
        : []),
    ],
  };
}
