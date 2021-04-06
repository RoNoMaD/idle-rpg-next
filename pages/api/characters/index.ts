import { Character } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Character | Error>
): Promise<void> => {
  const {
    method,
    body: { name },
  } = req;

  const session = await getSession({ req });
  if (session) {
    if (method === "POST") {
      const {
        _count: { characters: charactersCount },
      } = await prisma.user.findUnique({
        where: {
          email: session?.user?.email,
        },
        select: {
          _count: {
            select: {
              characters: true,
            },
          },
        },
      });

      if (charactersCount < 10) {
        const result = await prisma.character.create({
          data: {
            name,
            user: { connect: { email: session?.user?.email } },
          },
        });
        // Created
        res.status(201).json(result);
      } else {
        // can't create more than 10 characters
        res.status(405).json({
          name: "CREATE_CHARACTER_NO_MORE_THAN_TEN",
          message: "can't create more than 10 characters",
        });
      }
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
