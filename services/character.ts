import prisma from "../lib/prisma";
import { Character } from "@prisma/client";

type UpdatedValues = {
  health?: number;
  attack?: number;
  defense?: number;
  magik?: number;
};

export function getIncreaseSkillCost(
  originalSkillValue: number,
  skillName: string,
  skillValue: number
): number {
  // check if we do not try to decrease original skill value
  if (skillValue < originalSkillValue) {
    throw new Error("You cannot decrease a skill.");
  }
  if (skillName === "health") {
    return skillValue - originalSkillValue;
  } else {
    let skillCost = 0;
    for (
      let skillIndex = originalSkillValue;
      skillIndex < skillValue;
      skillIndex++
    ) {
      skillCost += skillIndex === 0 ? 1 : Math.ceil(skillIndex / 5);
    }
    return skillCost;
  }
}

export function getIncreaseSkillsCost(
  originalCharacter: Character,
  health: number,
  attack: number,
  defense: number,
  magik: number
): number {
  return (
    Object.entries({ health, attack, defense, magik })
      // get cost for every skill
      .map(([skillName, skillValue]) => {
        return getIncreaseSkillCost(
          originalCharacter[skillName],
          skillName,
          skillValue
        );
      })
      // sum up costs
      .reduce((a, b) => a + b, 0)
  );
}

export async function updateCharacter(
  characterId: number,
  userEmail: string,
  { health, attack, defense, magik }: UpdatedValues
): Promise<void> {
  const originalCharacter = await prisma.character.findFirst({
    where: {
      id: characterId,
      user: {
        email: userEmail,
      },
    },
  });

  const skillCost = getIncreaseSkillsCost(
    originalCharacter,
    health,
    attack,
    defense,
    magik
  );

  // check we have enought skill points
  if (skillCost >= originalCharacter.skillPoints) {
    await prisma.character.updateMany({
      where: {
        id: characterId,
        user: {
          email: userEmail,
        },
      },
      data: {
        health,
        attack,
        defense,
        magik,
        skillPoints: originalCharacter.skillPoints - skillCost,
      },
    });
  } else {
    throw new Error("You don't have enought skill points.");
  }
}
