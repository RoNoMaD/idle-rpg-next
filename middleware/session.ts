import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";

export function session(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ) => void | Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json({ name: "NOT_SIGNED_IN", message: "Not Signed in" });
    } else {
      await handler(req, res, session);
    }
  };
}
