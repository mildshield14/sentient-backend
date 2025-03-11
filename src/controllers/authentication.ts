import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, username and password are required" });
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(201).json({ user }).end();
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await getUserByEmail(
      email,
      "+authentication.password +authentication.salt",
    );

    if (!user || !user.authentication || !user.authentication.salt) {
      return res.status(400).json({ error: "User not found" });
    }

    const expectedHash: any = authentication(user.authentication.salt, password);

    if (user.authentication.password.toString() !== expectedHash.toString()) {
      return res.status(403).json({ error: "Invalid password" });
    }
    // const salt = random();
    // user.authentication.sessionToken = authentication(
    //   salt,
    //   user._id.toString(),
    // );
    await user.save();

    if (!user.authentication.sessionToken) {
      return res.status(404).json({ error: "User not found" });
    }

    res.cookie("auth_hereee", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json({ user }).end();
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.status(400).json({ error: error.message });
  }
};
