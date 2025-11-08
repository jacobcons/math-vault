export enum Calc {
  Both = 0,
  Calc = 1,
  NonCalc = 2,
}

export type ParsedSkill = {
  skillId: number;
  subskillChar: string | null;
};
