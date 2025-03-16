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
exports.login = exports.register = void 0;
const users_1 = require("../db/users");
const helpers_1 = require("../helpers");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res
                .status(400)
                .json({ error: "Email, username and password are required" });
        }
        const existingUser = yield (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const salt = (0, helpers_1.random)();
        const user = yield (0, users_1.createUser)({
            email,
            username,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password),
            },
        });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        return res.status(201).json({ user }).end();
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(500).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Login request body:", req.body); // <-- LOG THIS
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Missing fields");
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = yield (0, users_1.getUserByEmail)(email, "+authentication.password +authentication.salt");
        console.log("Found user:", user);
        if (!user || !user.authentication || !user.authentication.salt) {
            console.log("User not found or missing auth");
            return res.status(400).json({ error: "User not found" });
        }
        // Compare hashed password
        const expectedHash = (0, helpers_1.authentication)(user.authentication.salt, password);
        if (user.authentication.password.toString() !== expectedHash.toString()) {
            console.log("Invalid password");
            return res.status(403).json({ error: "Invalid password" });
        }
        console.log("Login success!");
        res.json({ user });
    }
    catch (error) {
        console.error("Login error:", error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.login = login;
//# sourceMappingURL=authentication.js.map