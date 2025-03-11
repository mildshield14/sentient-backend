import express from "express";
import {createNote, deleteNote, getAllNotes, updateNote} from "../controllers/notes";

export default (router:express.Router) => {
    router.get('/notes', getAllNotes);
    router.delete('/notes/:id', deleteNote);
    router.patch('/notes/:id',updateNote);
    router.post('/create-note', createNote);
}
