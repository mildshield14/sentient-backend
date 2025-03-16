"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("./authentication"));
const users_1 = __importDefault(require("./users"));
const spotify_1 = __importDefault(require("./spotify"));
const openweather_1 = __importDefault(require("./openweather"));
const notes_1 = __importDefault(require("./notes"));
const quotes_1 = __importDefault(require("./quotes"));
const image_1 = __importDefault(require("./image"));
const router = express_1.default.Router();
exports.default = () => {
    (0, authentication_1.default)(router);
    (0, users_1.default)(router);
    (0, spotify_1.default)(router);
    (0, openweather_1.default)(router);
    (0, notes_1.default)(router);
    (0, quotes_1.default)(router);
    (0, image_1.default)(router);
    return router;
};
// module.exports = () => {
//   return router;
// };
//# sourceMappingURL=index.js.map