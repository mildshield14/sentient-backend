import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userId = get(req, "identity._id") as unknown as string;
    const { id } = req.params;

    if (userId !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (userId.toString() !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(500).json({ error: error.message });
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies["auth_hereee"];
    if (!sessionToken) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    merge(req, { identity: user });
    return next();
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(500).json({ error: error.message });
  }
};