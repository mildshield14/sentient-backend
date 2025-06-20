// src/controllers/todos.ts
import express from "express";
import { createTodoDB, deleteTodoByID, getTodoByID, getTodos, updateTodoByID } from "../db/todos";

export const getAllTodos = async (_req: express.Request, res: express.Response) => {
    try {
        const todos = await getTodos();
        return res.status(200).json({ todos });
    } catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
};

export const createTodo = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { task, completed } = req.body;
        if (!task) {
            return res.status(400).json({ error: "Task is required" });
        }
        const newTodo = await createTodoDB({ task, completed });
        return res.status(201).json({ todo: newTodo });
    } catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(500).json({ error: error.message });
    }
};

export const deleteTodo = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Todo ID is required" });
        }
        const todo = await deleteTodoByID(id);
        return res.json({ todo });
    } catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
};

export const updateTodo = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;
        if (!task && completed === undefined) {
            return res.status(400).json({ error: "No fields to update" });
        }
        const todo = await getTodoByID(id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        if (task !== undefined) todo.task = task;
        if (completed !== undefined) todo.completed = completed;
        await todo.save();
        return res.status(200).json({ todo }).end();
    } catch (error) {
        console.log(error);
        // @ts-ignore
        return res.status(400).json({ error: error.message });
    }
};
