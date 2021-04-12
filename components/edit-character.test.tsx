import { getMaxForSkill } from "./edit-character";

test("if no skillPoints max should be current skill value", () => {
  const currentSkillValue = 12;
  expect(getMaxForSkill(currentSkillValue, 0)).toBe(currentSkillValue);
});

test("if only 2 skillPoints, skill value is 12, max should be current skill value", () => {
  expect(getMaxForSkill(12, 2)).toBe(12);
});

test("if only 2 skillPoints, skill value is 6, max should be 7", () => {
  expect(getMaxForSkill(6, 2)).toBe(7);
});
