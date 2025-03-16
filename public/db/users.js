"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateUserByID = exports.deleteUserByID = exports.createUser = exports.getUserByID = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.UserModel = void 0;
const mongoose = __importStar(require("mongoose"));
const userScheme = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
});
exports.UserModel = mongoose.model("User", userScheme);
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () { return exports.UserModel.find(); });
exports.getUsers = getUsers;
const getUserByEmail = (email, selectFields) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize the query without executing it
    const query = exports.UserModel.findOne({ email });
    // If select fields are provided, apply them to the query
    if (selectFields) {
        query.select(selectFields);
    }
    // Execute the query and return the result
    return yield query.exec();
});
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => exports.UserModel.findOne({ "authentication.sessionToken": sessionToken });
exports.getUserBySessionToken = getUserBySessionToken;
const getUserByID = (id) => exports.UserModel.findOne({ id });
exports.getUserByID = getUserByID;
const createUser = (values) => new exports.UserModel(values)
    .save()
    .then((user) => user.toObject());
exports.createUser = createUser;
const deleteUserByID = (id) => {
    exports.UserModel.findOneAndDelete({ _id: id });
};
exports.deleteUserByID = deleteUserByID;
const updateUserByID = (id, values) => {
    exports.UserModel.findByIdAndUpdate(id, values, { new: true });
};
exports.updateUserByID = updateUserByID;
//# sourceMappingURL=users.js.map