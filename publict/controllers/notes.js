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
exports.updateNote = exports.deleteNote = exports.createNote = exports.getAllNotes = void 0;
const notes_1 = require("../db/notes");
const getAllNotes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotes = yield (0, notes_1.getNotes)();
        return res.status(200).json({ quotes });
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.getAllNotes = getAllNotes;
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, tags } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        const newNote = yield (0, notes_1.createNoteDB)({ title, content, tags });
        return res.status(201).json({ note: newNote });
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(500).json({ error: error.message });
    }
});
exports.createNote = createNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Note ID is required" });
        }
        const quote = yield (0, notes_1.deleteNoteByID)(id);
        return res.json({ quote });
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.deleteNote = deleteNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quotename } = req.body;
        if (!quotename) {
            return res.status(400).json({ error: "Note ID is required" });
        }
        const quote = yield (0, notes_1.getNoteByID)(id);
        if (!quote) {
            return res.status(404).json({ error: "Quote not found" });
        }
        quote.id = id;
        yield quote.save();
        return res.status(200).json({ quote }).end();
    }
    catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
});
exports.updateNote = updateNote;
//# sourceMappingURL=notes.js.map