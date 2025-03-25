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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserByID = exports.deleteUserByID = exports.createUser = exports.getUserByID = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userScheme = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
    spotify: {
        id: { type: String, index: true },
        accessToken: { type: String },
        refreshToken: { type: String },
        expiresIn: { type: Number },
        tokenRetrievedAt: { type: Date, default: Date.now },
    },
});
exports.UserModel = mongoose_1.default.model("User", userScheme);
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return exports.UserModel.find();
});
exports.getUsers = getUsers;
const getUserByEmail = (email, selectFields) => __awaiter(void 0, void 0, void 0, function* () {
    const query = exports.UserModel.findOne({ email });
    if (selectFields) {
        query.select(selectFields);
    }
    return query.exec();
});
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => {
    return exports.UserModel.findOne({ "authentication.sessionToken": sessionToken });
};
exports.getUserBySessionToken = getUserBySessionToken;
const getUserByID = (id) => {
    return exports.UserModel.findOne({ _id: new mongoose_1.default.Types.ObjectId(id) });
};
exports.getUserByID = getUserByID;
const createUser = (values) => {
    return new exports.UserModel(values)
        .save()
        .then((user) => user.toObject());
};
exports.createUser = createUser;
const deleteUserByID = (id) => {
    // Return the deletion query result
    return exports.UserModel.findOneAndDelete({ _id: new mongoose_1.default.Types.ObjectId(id) });
};
exports.deleteUserByID = deleteUserByID;
const updateUserByID = (id, values) => {
    // Return the updated user; { new: true } returns the document AFTER the update
    return exports.UserModel.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(id), values, { new: true });
};
exports.updateUserByID = updateUserByID;
//# sourceMappingURL=users.js.map