import { myAdventures } from "kolmafia";
import { $familiar, get, withProperties } from "libram";
import { cliExecuteThrow } from "../lib";
import { areOrgansFull, isOverdrunk, isStooperDrunk } from "../organs";
import { caldera, stooper } from "./common";
import { Strategy } from "./strategy";
import { args } from "../args";

export const freecandy: Strategy = {
  name: "freecandy",
  tasks: (ascend: boolean) => [
    {
      name: "Require Outfit",
      completed: () => get("freecandy_treatOutfit") !== "",
      do: () => {
        throw new Error("freecandy_treatOutfit preference is not set");
      },
    },
    {
      name: "CONSUME",
      completed: () => areOrgansFull(),
      do: () => cliExecuteThrow(`CONSUME ALL VALUE ${args.minor.halloweenvoa} NOMEAT`),
      limit: { tries: 1 },
      tracking: "Garbo",
    },
    {
      name: "Garbo Nobarf",
      completed: () => (get("_garboCompleted", "") !== "" && areOrgansFull()) || isStooperDrunk(),
      do: () => cliExecuteThrow(`garbo nobarf target='witchess knight' ${ascend ? "ascend" : ""}`),
      limit: { tries: 1 },
      tracking: "Garbo",
    },
    {
      name: "Freecandy",
      completed: () => myAdventures() < 5 || isStooperDrunk(),
      do: () => cliExecuteThrow("freecandy"),
      outfit: {
        familiar: $familiar`Reagnimated Gnome`,
      },
      limit: { tries: 1 },
      tracking: "Freecandy",
    },
    stooper(),
    {
      name: "Overdrink",
      completed: () => isOverdrunk(),
      do: () =>
        withProperties({ spiceMelangeUsed: true, currentMojoFilters: 3 }, () =>
          cliExecuteThrow(
            `CONSUME VALUE ${args.minor.halloweenvoa} NIGHTCAP ${ascend ? "NOMEAT" : ""}`
          )
        ),
      outfit: { familiar: $familiar`Stooper` },
      limit: { tries: 1 },
    },
    ...(ascend ? [caldera()] : []),
    {
      name: "Overdrunk",
      ready: () => isOverdrunk(),
      completed: () => myAdventures() < 5,
      do: () => cliExecuteThrow("freecandy"),
      outfit: {
        familiar: $familiar`Reagnimated Gnome`,
      },
      limit: { tries: 1 },
      tracking: "Freecandy",
    },
    ...(ascend
      ? [
          {
            name: "Combo",
            completed: () => myAdventures() === 0,
            do: () => cliExecuteThrow(`combo ${myAdventures()}`),
            limit: { tries: 1 },
          },
        ]
      : []),
  ],
};
