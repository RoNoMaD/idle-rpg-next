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
