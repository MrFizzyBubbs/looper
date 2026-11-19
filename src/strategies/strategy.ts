import { LoopTask } from "../engine/engine";

export type Strategy = {
  name: string;
  tasks: (ascend: boolean) => LoopTask[];
};
