import {
  fullnessLimit,
  inebrietyLimit,
  myFamiliar,
  myFullness,
  myInebriety,
  mySpleenUse,
  spleenLimit,
} from "kolmafia";
import { $familiar } from "libram";

function stooperInebrietyLimit(): number {
  return inebrietyLimit() + Number(myFamiliar() !== $familiar`Stooper`);
}

export function areOrgansFull(): boolean {
  return (
    myFullness() >= fullnessLimit() &&
    myInebriety() >= stooperInebrietyLimit() - 1 &&
    mySpleenUse() >= spleenLimit()
  );
}

export function isStooperDrunk(): boolean {
  return myInebriety() >= stooperInebrietyLimit();
}

export function isOverdrunk(): boolean {
  return myInebriety() > stooperInebrietyLimit();
}
