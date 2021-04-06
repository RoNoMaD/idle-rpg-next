import { getIncreaseSkillCost, getIncreaseSkillsCost } from "./character";

test("original health at 1 and wanted health at 3 to cost 2 skill points", () => {
  expect(getIncreaseSkillCost(1, "health", 3)).toBe(2);
});

test("original attack at 1 and wanted attack at 3 to cost 2 skill points", () => {
  expect(getIncreaseSkillCost(1, "attack", 3)).toBe(2);
});

test("original attack at 0 and wanted attack at 7 to cost 8 skill points", () => {
  expect(getIncreaseSkillCost(0, "attack", 7)).toBe(8);
});

test("original attack at 5 and wanted attack at 2 to throw an error", () => {
  expect(() => {
    getIncreaseSkillCost(5, "attack", 2);
  }).toThrowError("You cannot decrease a skill.");
});

test(`original attack at 0 and wanted attack at 7 and
original health at 1 and wanted health at 3
 to cost 8 skill points`, () => {
  const originalCharater = {
    id: 0,
    name: "test",
    level: 1,
    skillPoints: 12,
    health: 1,
    attack: 0,
    defense: 0,
    magik: 0,
    userId: 0,
  };
  expect(getIncreaseSkillsCost(originalCharater, 3, 7, 0, 0)).toBe(8);
});
