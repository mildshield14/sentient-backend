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
    console.log("Login request body:", req.body); // <-- LOG THIS
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing fields");
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await getUserByEmail(
        email,
        "+authentication.password +authentication.salt"
    );
    console.log("Found user:", user);

    if (!user || !user.authentication || !user.authentication.salt) {
      console.log("User not found or missing auth");
      return res.status(400).json({ error: "User not found" });
    }

    // Compare hashed password
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password.toString() !== expectedHash.toString()) {
      console.log("Invalid password");
      return res.status(403).json({ error: "Invalid password" });
    }

    console.log("Login success!");
    res.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ error: error.message });
  }
};

