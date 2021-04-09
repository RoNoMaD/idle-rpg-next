import { Character } from "@prisma/client";
import prisma from "@lib/prisma";

export async function findCharacterById(id: number): Promise<Character> {
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
