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
    router.get("/image", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const mood = req.query.mood || "happy";
        const apiKey = process.env.IMAGE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API key is missing" });
        }
        const options = {
            method: "GET",
            url: "https://api.unsplash.com/search/photos/",
            params: {
                client_id: process.env.IMAGE_API_KEY,
                query: "scenery",
                page: Math.floor(Math.random() * 200) + 1,
                per_page: "1",
            },
        };
        try {
            const response = yield axios_1.default.request(options);
            console.log(response.data);
            const filteredData = response.data.results.map((item) => {
                let description = item.description || item.alt_description || "No description available";
                return {
                    id: item.id,
                    description: description,
                    urls: item.urls.raw,
                    author: item.user ? item.user.name : null,
                    location: item.user ? item.user.location : null,
                };
            });
            res.status(200).json(filteredData);
        }
        catch (error) {
            console.error(error);
            res.sendStatus(400);
        }
    }));
};
//# sourceMappingURL=image.js.map