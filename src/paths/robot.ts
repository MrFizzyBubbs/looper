import { cliExecute, myPath, runChoice, visitUrl } from "kolmafia";
import { $class, $item, $path, ascend, Lifestyle, prepareAscension, set } from "libram";
import { ascendedToday, createPermOptions } from "../lib";
import { breakStone } from "./common";
import { LoopQuest } from "../engine/engine";
import { step } from "grimoire-kolmafia";

export function robotQuest(): LoopQuest {
  return {
    name: "Robot",
    tasks: [
      {
        name: "Ascend",
        completed: () => ascendedToday(),
        do: (): void => {
          prepareAscension({
            garden: "packet of tall grass seeds",
            eudora: "Our Daily Candles™ order form",
            chateau: {
              desk: "continental juice bar",
              ceiling: "ceiling fan",
              nightstand: "foreign language tapes",
            },
          });
          visitUrl("council.php"); // Collect thwaitgold
          ascend({
            path: $path`You, Robot`,
            playerClass: $class`Pastamancer`,
            lifestyle: Lifestyle.softcore,
            moon: "vole",
            consumable: $item`astral six-pack`,
            pet: $item`astral mask`,
            permOptions: createPermOptions(),
          });
          set("choiceAdventure1446", 1);
          if (visitUrl("main.php").includes("one made of rusty metal and scrap wiring"))
            runChoice(-1);
        },
        limit: { tries: 1 },
      },
      breakStone(),
      {
        name: "Run",
        ready: () => myPath() === $path`You, Robot`,
        completed: () => step("questL13Final") > 11,
        do: () => cliExecute("looprobot"),
        limit: { tries: 1 },
        tracking: "Run",
      },
      {
        name: "Prism",
        completed: () => myPath() !== $path`You, Robot`,
        do: () => visitUrl("place.php?whichplace=nstower&action=ns_11_prism"),
        limit: { tries: 1 },
        tracking: "Ignore",
      },
    ],
  };
}
