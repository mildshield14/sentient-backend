import express from "express";
import {deleteUser, getAllUsers, updateUser} from "../controllers/users";
import {isAuthenticated, isOwner} from "../middlewares";

export default (router:express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.get("/test-db", async (req, res) => {
        console.log("Testing database connection...");

        try {
            const users = await User.find().limit(1); // Fetch one user
            console.log("MongoDB connection successful!");
            return res.json({ success: true, user: users[0] || "No users found" });
        } catch (error) {
            console.error("MongoDB Connection Error:", error);
            return res.status(500).json({ error: "Database connection failed" });
        }
    });
    router.delete('/users/:id', isOwner, isAuthenticated, deleteUser);
    router.patch('/users/:id', isOwner, isAuthenticated, updateUser);
}
