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
const axios_1 = __importDefault(require("axios"));
exports.default = (router) => {
    router.get("/quotes", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const mood = req.query.mood || "happy";
        const options = {
            method: "GET",
            url: "https://quotes15.p.rapidapi.com/quotes/random/",
            params: {
                language_code: "en",
            },
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_QUOTE_KEY,
                "x-rapidapi-host": "quotes15.p.rapidapi.com",
            },
        };
        console.log(process.env.RAPID_API_QUOTE_KEY);
        try {
            const response = yield axios_1.default.request(options);
            console.log(response.data);
            res.status(200).json(response.data);
        }
        catch (error) {
            console.error(error);
            res.sendStatus(400);
        }
    }));
};
//# sourceMappingURL=quotes.js.map