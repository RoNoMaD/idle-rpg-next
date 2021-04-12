import prisma from "../lib/prisma";
import { Character } from "types/index";

import { updateCharacter } from "@dao/characters";

type UpdatedValues = {
  health?: number;
  attack?: number;
  defense?: number;
  magik?: number;
};

export class ServiceError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

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
  newSkillsValues: UpdatedValues
): number {
  return (
    Object.entries(newSkillsValues)
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

/**
 * Update a character
 * @param {number} characterId - the character identifier
 * @param {string} userEmail - the user email
 * @param {UpdatedValues} newSkillsValues - the user email
 *
 * @return  {Promise<void>}
 * @throws {ServiceError}
 */
export async function upgradeCharacter(
  characterId: number,
  userEmail: string,
  newSkillsValues: UpdatedValues
): Promise<void> {
  const originalCharacter = await prisma.character.findFirst({
    where: {
      id: characterId,
      user: {
        email: userEmail,
      },
    },
  });
  if (originalCharacter) {
    const skillCost = getIncreaseSkillsCost(originalCharacter, newSkillsValues);

    // check we have enought skill points
    if (skillCost <= originalCharacter.skillPoints) {
      await updateCharacter(characterId, userEmail, {
        ...newSkillsValues,
        skillPoints: originalCharacter.skillPoints - skillCost,
      });
    } else {
      throw new ServiceError(422, "You don't have enought skill points.");
    }
  } else {
    throw new ServiceError(404, "This character doesn't exist for this user.");
  }
}
