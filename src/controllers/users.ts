import express from "express";
import { deleteUserByID, getUserByID, getUsers } from "../db/users";

export const getAllUsers = async (_req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await deleteUserByID(id);
    return res.json({ user });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await getUserByID(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = username;
    await user.save();

    return res.status(200).json({ user }).end();
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(400).json({ error: error.message });
  }
};

