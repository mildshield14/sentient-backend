import express from "express";
import {createNoteDB, deleteNoteByID, getNoteByID, getNotes} from "../db/notes";

export const getAllNotes = async (_req: express.Request, res: express.Response) => {
  try {
    const quotes = await getNotes();
    return res.status(200).json({ quotes });
  } catch (error) {
    console.log(error);
    // @ts-ignore
      return res.status(400).json({ error: error.message });
  }
};

export const createNote = async (
    req: express.Request,
res: express.Response,
) => {
    try{
            const { title, content, tags } = req.body;
            if (!title || !content) {
                return res.status(400).json({ error: "Title and content are required" });
            }

            const newNote = await createNoteDB({ title, content, tags });
            return res.status(201).json({ note: newNote });
        } catch (error) {
            console.log(error);
            // @ts-ignore
        return res.status(500).json({ error: error.message });
        }
    }


export const deleteNote = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Note ID is required" });
        }
        const quote = await deleteNoteByID(id);
        return res.json({ quote });
    } catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
};

export const updateNote = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { id } = req.params;
        const { quotename } = req.body;
        if (!quotename) {
            return res.status(400).json({ error: "Note ID is required" });
        }
        const quote = await getNoteByID(id);


        if (!quote) {
            return res.status(404).json({ error: "Quote not found" });
        }

        quote.id = id;
        await quote.save();

        return res.status(200).json({ quote }).end();
    } catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
};

