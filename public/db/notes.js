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
exports.getNotesByTagTitleAndContent = exports.getNotesByTitleAndContent = exports.getNotesByTagAndContent = exports.getNotesByTagAndTitle = exports.getNotesByContent = exports.getNotesByTitle = exports.getNotesByTag = exports.updateNoteByID = exports.deleteNoteByID = exports.createNoteDB = exports.getNoteByID = exports.getNotes = exports.NotesModel = void 0;
const mongoose = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
var NoteStatus;
(function (NoteStatus) {
    NoteStatus["IMPORTANT"] = "important";
    NoteStatus["NORMAL"] = "normal";
    NoteStatus["DONE"] = "done";
    NoteStatus["DO_NOT_FORGET"] = "do_not_forget";
    NoteStatus["CUSTOM"] = "custom";
})(NoteStatus || (NoteStatus = {}));
const notesScheme = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], enum: Object.values(NoteStatus), required: false },
});
exports.NotesModel = mongoose.model("Notes", notesScheme);
const getNotes = () => __awaiter(void 0, void 0, void 0, function* () { return exports.NotesModel.find(); });
exports.getNotes = getNotes;
const getNoteByID = (id) => __awaiter(void 0, void 0, void 0, function* () { return exports.NotesModel.findOne({ _id: id }); });
exports.getNoteByID = getNoteByID;
const createNoteDB = (values) => {
    values.id = (0, uuid_1.v4)();
    return new exports.NotesModel(values)
        .save()
        .then((note) => note.toObject());
};
exports.createNoteDB = createNoteDB;
const deleteNoteByID = (id) => {
    exports.NotesModel.findOneAndDelete({ _id: id });
};
exports.deleteNoteByID = deleteNoteByID;
const updateNoteByID = (id, values) => {
    exports.NotesModel.findByIdAndUpdate(id, values, { new: true });
};
exports.updateNoteByID = updateNoteByID;
const getNotesByTag = (tag) => exports.NotesModel.find({ tags: tag });
exports.getNotesByTag = getNotesByTag;
const getNotesByTitle = (title) => exports.NotesModel.find({ title });
exports.getNotesByTitle = getNotesByTitle;
const getNotesByContent = (content) => exports.NotesModel.find({ content });
exports.getNotesByContent = getNotesByContent;
const getNotesByTagAndTitle = (tag, title) => exports.NotesModel.find({ tags: tag, title });
exports.getNotesByTagAndTitle = getNotesByTagAndTitle;
const getNotesByTagAndContent = (tag, content) => exports.NotesModel.find({ tags: tag, content });
exports.getNotesByTagAndContent = getNotesByTagAndContent;
const getNotesByTitleAndContent = (title, content) => exports.NotesModel.find({ title, content });
exports.getNotesByTitleAndContent = getNotesByTitleAndContent;
const getNotesByTagTitleAndContent = (tag, title, content) => exports.NotesModel.find({ tags: tag, title, content });
exports.getNotesByTagTitleAndContent = getNotesByTagTitleAndContent;
//# sourceMappingURL=notes.js.map