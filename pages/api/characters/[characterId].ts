import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
// import * as yup from "yup";

import { updateCharacter } from "../../../services/character";

import prisma from "../../../lib/prisma";

type CharacterData = {
  name: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<CharacterData>
): Promise<void> => {
  const session = await getSession({ req });
  if (session) {
    const {
      method,
      query: { characterId },
      body: { health, attack, defense, magik },
    } = req;

    if (method === "PATCH") {
      // TODO validate body data
      // @see https://dev.to/bmvantunes/next-js-api-routes-validation-with-yup-1nd9
      // or
      // @see https://dev.to/meddlesome/nextjs-apis-validator-with-middleware-3njl
      await updateCharacter(Number(characterId), session.user.email, {
        health,
        attack,
        defense,
        magik,
      });
      // OK (if we choose to return the updated entity)
      res.status(200);

      // or NO CONTENT
      // res.status(204);
      // or Unprocessable request (Unprocessable Entity) (impossible to update entity with these values)
      // res.status(422);
      // or Malformed patch document (try to modify unallowed entity fields)
      // res.status(400);
      // Resource not found (the entity does not exist)
      // res.status(404);
    } else if (method === "DELETE") {
      // TODO check userId
      const character = await prisma.character.delete({
        where: { id: Number(characterId) },
      });
      // OK
      res.status(200).json(character);
    } else {
      // Method Not Allowed
      res.status(405);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
