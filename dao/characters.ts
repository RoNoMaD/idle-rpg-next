import { Character, Prisma } from "@prisma/client";

import prisma from "@lib/prisma";

export async function findCharacterById(id: number): Promise<Character | null> {
  return await prisma.character.findUnique({
    where: {
      id,
    },
  });
}

export async function findCharactersByUserEmail(
  email: string
): Promise<Character[]> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user === null) {
    throw new Error("Can't find any user with this email.");
  }

  return await prisma.character.findMany({
    where: {
      userId: user.id,
    },
  });
}

export async function deleteCharacterById(id: number): Promise<Character> {
  return await prisma.character.delete({
    where: { id },
  });
}

export async function countUserCharacters(email: string): Promise<number> {
  const {
    _count: { characters: charactersCount },
  } = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      _count: {
        select: {
          characters: true,
        },
      },
    },
  });
  return charactersCount;
}

export async function createCharacter(
  name: string,
  userEmail: string
): Promise<Character> {
  return await prisma.character.create({
    data: {
      name,
      user: { connect: { email: userEmail } },
    },
  });
}

type UpdatedValues = {
  health?: number;
  attack?: number;
  defense?: number;
  magik?: number;
  skillPoints: number;
};

export async function updateCharacter(
  characterId: number,
  userEmail: string,
  data: UpdatedValues
): Promise<Prisma.BatchPayload> {
  return await prisma.character.updateMany({
    where: {
      id: characterId,
      user: {
        email: userEmail,
      },
    },
    data,
  });
}
