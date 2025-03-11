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
exports.isAuthenticated = exports.isOwner = void 0;
const lodash_1 = require("lodash");
const users_1 = require("../db/users");
const isOwner = (req, res, next) => {
    try {
        const userId = (0, lodash_1.get)(req, "identity._id");
        const { id } = req.params;
        if (userId !== id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        if (userId.toString() !== id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        next();
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(500).json({ error: error.message });
    }
};
exports.isOwner = isOwner;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionToken = req.cookies["auth_hereee"];
        if (!sessionToken) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const user = yield (0, users_1.getUserBySessionToken)(sessionToken);
        if (!user) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        (0, lodash_1.merge)(req, { identity: user });
        return next();
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(500).json({ error: error.message });
    }
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=index.js.map