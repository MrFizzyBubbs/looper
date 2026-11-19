import { getWorkshed, Item, myAdventures } from "kolmafia";
import { $effect, $familiar, $item, get, have, withProperties } from "libram";
import { cliExecuteThrow } from "../lib";
import { areOrgansFull, isOverdrunk, isStooperDrunk } from "../organs";
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
        (get("_garboCompleted", "") !== "" && myAdventures() === 0 && areOrgansFull()) ||
        isStooperDrunk(),
      do: () => cliExecuteThrow(`garbo ${ascend ? "ascend" : ""} workshed="${chooseWorkshed()}"`),
      limit: { tries: 1 },
      tracking: "Garbo",
    },
    stooper(),
    {
      name: "Overdrink",
      completed: () => isOverdrunk(),
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
            ready: () => isOverdrunk(),
            completed: () => myAdventures() === 0,
            do: () => cliExecuteThrow("garbo ascend"),
            limit: { tries: 1 },
            tracking: "Garbo",
          },
        ]
      : []),
  ],
};
