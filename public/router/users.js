"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const middlewares_1 = require("../middlewares");
const users_2 = require("../db/users");
exports.default = (router) => {
    router.get("/users", middlewares_1.isAuthenticated, users_1.getAllUsers);
    router.post("/user/:id/photo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        const { photo } = req.body;
        if (!photo) {
            return res.status(400).json({ error: "Photo URL is required" });
        }
        try {
            const updatedUser = yield (0, users_2.updateUserByID)(userId, { photo });
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }));
    router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        try {
            const user = yield (0, users_2.getUserByID)(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }));
    router.delete("/users/:id", middlewares_1.isOwner, middlewares_1.isAuthenticated, users_1.deleteUser);
    router.patch("/users/:id", middlewares_1.isOwner, middlewares_1.isAuthenticated, users_1.updateUser);
};
//# sourceMappingURL=users.js.map