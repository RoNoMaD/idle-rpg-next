import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

import { session } from "middleware/session";
import { upgradeCharacter } from "@services/characters";
import { deleteCharacterById } from "@dao/characters";
import {
  characterIdSchema,
  updateCharacterSchema,
} from "schemas/charactersSchemas";

type CharacterData = {
  name: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CharacterData | Error>,
  session: Session
): Promise<void> => {
  const { method } = req;

  let characterId: number;
  if (method === "PATCH") {
    // validation
    try {
      characterId = await characterIdSchema.validate(req.query.characterId, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = await updateCharacterSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      // Malformed patch document (try to modify unallowed entity fields)
      return res.status(400).json(error);
    }
    try {
      await upgradeCharacter(characterId, session.user.email, req.body);
    } catch (error) {
      // Resource not found (the entity does not exist)
      // res.status(404);
      // or Unprocessable request (Unprocessable Entity) (impossible to update entity with these values)
      res.status(error.code || 500).json(error);
    }
    // OK (if we choose to return the updated entity)
    res.status(200);
  } else if (method === "DELETE") {
    // validation
    try {
      characterId = await characterIdSchema.validate(req.query.characterId, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
    // TODO check userId
    const character = await deleteCharacterById(characterId);
    // OK
    res.status(200).json(character);
  } else {
    // Method Not Allowed
    res.setHeader("Allow", ["PATCH", "DELETE"]);
    res.status(405).json({
      name: "METHOD_NOT_ALLOWED",
      message: `Method ${method} Not Allowed`,
    });
  }
};

export default session(handler);
