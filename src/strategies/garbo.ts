import { getWorkshed, inebrietyLimit, Item, myAdventures, myInebriety } from "kolmafia";
import { $effect, $familiar, $item, get, have, withProperties } from "libram";
import { canConsume, cliExecuteThrow, stooperInebrietyLimit } from "../lib";
import { caldera, stooper } from "./common";
import { Strategy } from "./strategy";

function chooseWorkshed(): Item {
  if (
    getWorkshed() !== $item`Asdon Martin keyfob (on ring)` &&
    !have($effect`Driving Observantly`)
  ) {
    return $item`Asdon Martin keyfob (on ring)`;
  }
  if (getWorkshed() !== $item`cold medicine cabinet`) {
    return $item`cold medicine cabinet`;
  }
  return $item`model train set`;
}

export const garbo: Strategy = {
  name: "garbo",
  tasks: (ascend: boolean) => [
    {
      name: "Garbo",
      completed: () =>
        (get("_garboCompleted", "") !== "" && myAdventures() === 0 && !canConsume()) ||
        myInebriety() >= stooperInebrietyLimit(),
      do: () => cliExecuteThrow(`garbo ${ascend ? "ascend" : ""} workshed="${chooseWorkshed()}"`),
      limit: { tries: 1 },
      tracking: "Garbo",
    },
    stooper(),
    {
      name: "Overdrink",
      completed: () => myInebriety() > stooperInebrietyLimit(),
      do: () =>
        withProperties({ spiceMelangeUsed: true, currentMojoFilters: 3 }, () =>
          cliExecuteThrow(`CONSUME NIGHTCAP ${ascend ? "VALUE 3250" : ""}`)
        ),
      outfit: { familiar: $familiar`Stooper` },
      limit: { tries: 1 },
    },
    ...(ascend
      ? [
          caldera(),
          {
            name: "Overdrunk",
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
