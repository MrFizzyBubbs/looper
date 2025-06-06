import { Args, getTasks } from "grimoire-kolmafia";
import { cliExecute, print } from "kolmafia";
import { args } from "./args";
import { LoopEngine } from "./engine/engine";
import { debug, loopValue, numberWithCommas, rolloverTurns } from "./lib";
import { Snapshot } from "./snapshot";
import { aftercoreQuest } from "./paths/aftercore";
import { casualQuest } from "./paths/casual";
import { csQuest } from "./paths/cs";
import { smolQuest } from "./paths/smol";
import { postQuest } from "./paths/post";
import { setStrategy } from "./strategies/strategy";
import { robotQuest } from "./paths/robot";
import { get } from "libram";

const snapshotStart = Snapshot.importOrCreate("Start");

export function main(command?: string): void {
  Args.fill(args, command);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  setStrategy();
  const quests = getQuests(args.major.path);
  const tasks = getTasks(quests);

  // Abort during the prepare() step of the specified task
  if (args.debug.abort) {
    const to_abort = tasks.find((task) => task.name === args.debug.abort);
    if (!to_abort) throw `Unable to identify task ${args.debug.abort}`;
    to_abort.prepare = (): void => {
      throw `Abort requested on task ${to_abort.name}`;
    };
  }

  if (!get("_gitUpdated")) cliExecute("git update");

  const engine = new LoopEngine(tasks, args.debug.completedtasks?.split(",") ?? [], "looper");
  try {
    if (args.debug.list) {
      listTasks(engine);
      return;
    }

    engine.run();
  } finally {
    engine.destruct();
  }

  printFulldaySnapshot();

  const { actual, lost } = rolloverTurns();
  print(`Will start tomorrow with ${actual} turns (after potato and hourglass)`);
  print(`Will lose ${lost} turns to rollover`, lost > 0 ? "red" : "black");
}

function getQuests(path: string) {
  switch (path) {
    case "cs":
      return [aftercoreQuest(), csQuest(), postQuest()];
    case "casual":
      return [aftercoreQuest(), casualQuest(), postQuest()];
    case "smol":
      return [aftercoreQuest(), smolQuest(), postQuest()];
    case "robot":
      return [aftercoreQuest(), robotQuest(), postQuest()];
    case "custom":
      return [aftercoreQuest()];
    case "none":
      return [postQuest()];
    default:
      throw `Unknown run type ${path}`;
  }
}

function listTasks(engine: LoopEngine): void {
  for (const task of engine.tasks) {
    if (task.completed()) {
      debug(`${task.name}: Done`, "blue");
    } else if (engine.available(task)) {
      debug(`${task.name}: Available`);
    } else {
      debug(`${task.name}: Not Available`, "red");
    }
  }
}

function printFulldaySnapshot() {
  const { meat, items, itemDetails } = Snapshot.current().diff(snapshotStart).value(loopValue);
  const winners = itemDetails.sort((a, b) => b.value - a.value).slice(0, 5);
  const losers = itemDetails.sort((a, b) => b.value - a.value).slice(-5);

  print("");
  print(
    `So far today, you have generated ${numberWithCommas(
      meat + items
    )} meat, with ${numberWithCommas(meat)} raw meat and ${numberWithCommas(items)} from items`
  );
  print("Extreme Items:");
  for (const detail of [...winners, ...losers]) {
    print(
      `${numberWithCommas(detail.quantity)} ${detail.item} worth ${numberWithCommas(
        Math.round(detail.value)
      )} total`
    );
  }
}
