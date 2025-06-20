
import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const todoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

export const TodoModel = mongoose.model("Todo", todoSchema);

export const getTodos = async () => TodoModel.find();

export const getTodoByID = async (id: string) => TodoModel.findOne({ _id: id });

export const createTodoDB = (values: Record<string, any>) => {
    values.id = uuidv4();
    return new TodoModel(values)
        .save()
        .then((todo: { toObject: () => any }) => todo.toObject());
};

export const deleteTodoByID = (id: string) => {
    return TodoModel.findOneAndDelete({ _id: id });
};

export const updateTodoByID = (id: string, values: Record<string, any>) => {
    return TodoModel.findByIdAndUpdate(id, values, { new: true });
};
