import { Character } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { countUserCharacters, createCharacter } from "@dao/characters";
import { createCharacterSchema } from "schemas/charactersSchemas";
import { session } from "middleware/session";
import { Session } from "next-auth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Character | Error>,
  session: Session
): Promise<void> => {
  const { method } = req;
  if (method === "POST") {
    try {
      req.body = await createCharacterSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
    const charactersCount = await countUserCharacters(session?.user?.email);

    if (charactersCount < 10) {
      const character = await createCharacter(
        req.body.name,
        session?.user?.email
      );
      // Created
      return res.status(201).json(character);
    } else {
      // can't create more than 10 characters
      return res.status(405).json({
        name: "CREATE_CHARACTER_NO_MORE_THAN_TEN",
        message: "can't create more than 10 characters",
      });
    }
  } else {
    // Method Not Allowed
    res
      .status(405)
      .json({ name: "METHOD_NOT_ALLOWED", message: "Method Not Allowed" });
  }
};

export default session(handler);
