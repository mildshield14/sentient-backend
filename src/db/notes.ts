import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

enum NoteStatus {
    IMPORTANT = "important",
    NORMAL = "normal",
    DONE = "done",
    DO_NOT_FORGET = "do_not_forget",
    CUSTOM = "custom",
}

const notesScheme = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String],  enum: Object.values(NoteStatus), required: false },
});

export const NotesModel = mongoose.model("Notes", notesScheme);

export const getNotes = async () => NotesModel.find();

export const getNoteByID = async (id: string) => NotesModel.findOne({ _id: id });

export const createNoteDB = (values: Record<string, any>) => {
    values.id = uuidv4();
    return new NotesModel(values)
        .save()
        .then((note: { toObject: () => any }) => note.toObject());
};


export const deleteNoteByID = (id: string) => {
  NotesModel.findOneAndDelete({ _id: id });
}

export const updateNoteByID = (id: string, values: Record<string, any>) => {
  NotesModel.findByIdAndUpdate(id, values, { new: true });
}

export const getNotesByTag = (tag: string) => NotesModel.find({ tags: tag });

export const getNotesByTitle = (title: string) => NotesModel.find({ title });

export const getNotesByContent = (content: string) => NotesModel.find({ content });

export const getNotesByTagAndTitle = (tag: string, title: string) => NotesModel.find({ tags: tag, title });

export const getNotesByTagAndContent = (tag: string, content: string) => NotesModel.find({ tags: tag, content });

export const getNotesByTitleAndContent = (title: string, content: string) => NotesModel.find({ title, content });

export const getNotesByTagTitleAndContent = (tag: string, title: string, content: string) => NotesModel.find({ tags: tag, title, content });
