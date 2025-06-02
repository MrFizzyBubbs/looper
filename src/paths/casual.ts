import { step } from "grimoire-kolmafia";
import { cliExecute, myPath, visitUrl } from "kolmafia";
import { $item, $path, $skill, ascend, have, Lifestyle, prepareAscension } from "libram";
import { args } from "../args";
import { LoopQuest } from "../engine/engine";
import { ascendedToday, byAscendingStat, createPermOptions } from "../lib";
import { breakStone, duffo } from "./common";

export function casualQuest(): LoopQuest {
  return {
    name: "Casual",
    tasks: [
      {
        name: "Ascend",
        completed: () => ascendedToday(),
        do: (): void => {
          prepareAscension({
            garden: "packet of thanksgarden seeds",
            eudora: "GameInformPowerDailyPro subscription card",
            chateau: {
              desk: "Swiss piggy bank",
              nightstand: byAscendingStat({
                Muscle: "electric muscle stimulator",
                Mysticality: "foreign language tapes",
                Moxie: "bowl of potpourri",
              }),
              ceiling: "ceiling fan",
            },
          });
          visitUrl("council.php"); // Collect thwaitgold
          ascend({
            path: $path`none`,
            playerClass: args.major.class,
            lifestyle: Lifestyle.casual,
            moon: "knoll",
            consumable: $item`astral six-pack`,
            pet: $item`astral pet sweater`,
            permOptions: createPermOptions(),
          });
        },
        limit: { tries: 1 },
      },
      breakStone(),
      ...duffo([]),
      {
        name: "Run",
        ready: () => myPath() === $path`none`,
        completed: () => step("questL13Final") > 11 && have($skill`Liver of Steel`),
        do: (): void => {
          cliExecute("loopstar workshed='Asdon Martin keyfob'");
        },
        limit: { tries: 1 },
        tracking: "Run",
      },
      {
        name: "Prism",
        completed: () => step("questL13Final") === 999,
        do: () => visitUrl("place.php?whichplace=nstower&action=ns_11_prism"),
        limit: { tries: 1 },
        tracking: "Ignore",
      },
    ],
  };
}
