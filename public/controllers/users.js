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
exports.updateUser = exports.deleteUser = exports.getAllUsers = void 0;
const users_1 = require("../db/users");
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, users_1.getUsers)();
        return res.status(200).json({ users });
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = yield (0, users_1.deleteUserByID)(id);
        return res.json({ user });
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = yield (0, users_1.getUserByID)(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.username = username;
        yield user.save();
        return res.status(200).json({ user }).end();
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=users.js.map