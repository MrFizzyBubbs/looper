import {
  cliExecute,
  getWorkshed,
  maximize,
  numericModifier,
  retrieveItem,
  retrievePrice,
  use,
  useSkill,
} from "kolmafia";
import {
  $effect,
  $item,
  $skill,
  AsdonMartin,
  ChateauMantegna,
  get,
  have,
  haveInCampground,
} from "libram";
import { LoopQuest } from "../engine/engine";
import { getStrategy } from "../strategies/strategy";
import { batfellow, breakfast, duffo, pullAll } from "./common";

export function postQuest(): LoopQuest {
  return {
    name: "Post",
    tasks: [
      pullAll(),
      {
        name: "Workshed",
        completed: () => getWorkshed() === $item`cold medicine cabinet` || get("_workshedItemUsed"),
        do: (): void => {
          AsdonMartin.drive($effect`Driving Observantly`, 1300);
          use($item`cold medicine cabinet`);
        },
        limit: { tries: 1 },
      },
      ...breakfast(),
      ...duffo(),
      ...batfellow(),
      ...getStrategy().tasks(false),
      {
        name: "Raffle",
        completed: () => have($item`raffle ticket`),
        do: () => cliExecute(`raffle ${Math.random() * 10 + 1}`),
        limit: { tries: 1 },
      },
      {
        name: "Chateau Skylight",
        completed: () =>
          !ChateauMantegna.have() || ChateauMantegna.getCeiling() === "artificial skylight",
        do: () => ChateauMantegna.changeCeiling("artificial skylight"),
        limit: { tries: 1 },
      },
      {
        name: "Scepter",
        completed: () => get("_augSkillsCast", 0) >= 5 || have($effect`Offhand Remarkable`),
        do: () => useSkill($skill`Aug. 13th: Left/Off Hander's Day!`),
        limit: { tries: 1 },
      },
      {
        name: "Pajamas",
        completed: () =>
          maximize("adv, switch tot, switch left-hand man, switch disembodied hand", true) &&
          numericModifier("Generated:_spec", "Adventures") <= numericModifier("Adventures"),
        prepare: () => cliExecute("refresh all"),
        do: () => maximize("adv, switch tot, switch left-hand man, switch disembodied hand", false),
        limit: { tries: 1 },
      },
      {
        name: "Clockwork Maid",
        completed: () =>
          haveInCampground($item`clockwork maid`) ||
          numericModifier($item`clockwork maid`, "Adventures") * get("valueOfAdventure") <
            retrievePrice($item`clockwork maid`),
        do: (): void => {
          retrieveItem($item`clockwork maid`);
          use($item`clockwork maid`);
        },
        limit: { tries: 1 },
      },
    ],
  };
}
