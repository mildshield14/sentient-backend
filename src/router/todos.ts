
import express from "express";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "../controllers/todos";

export default (router: express.Router) => {
    router.get('/todos', getAllTodos);
    router.post('/create-todo', createTodo);
    router.delete('/todos/:id', deleteTodo);
    router.patch('/todos/:id', updateTodo);
};
