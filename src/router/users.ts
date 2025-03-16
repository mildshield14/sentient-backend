import express from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";
import { getUserByID, updateUserByID } from "../db/users";

export default (router: express.Router) => {
    router.get("/users", isAuthenticated, getAllUsers);

    router.post("/user/:id/photo", async (req, res) => {
        const userId = req.params.id;
        const { photo } = req.body;

        if (!photo) {
            return res.status(400).json({ error: "Photo URL is required" });
        }

        try {
            const updatedUser = await updateUserByID(userId, { photo });
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/user/:id", async (req, res) => {
        const userId = req.params.id;

        try {
            const user = await getUserByID(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    router.delete("/users/:id", isOwner, isAuthenticated, deleteUser);
    router.patch("/users/:id", isOwner, isAuthenticated, updateUser);
};
