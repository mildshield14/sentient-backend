"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notes_1 = require("../controllers/notes");
exports.default = (router) => {
    router.get('/notes', notes_1.getAllNotes);
    router.delete('/notes/:id', notes_1.deleteNote);
    router.patch('/notes/:id', notes_1.updateNote);
    router.post('/create-note', notes_1.createNote);
};
//# sourceMappingURL=notes.js.map