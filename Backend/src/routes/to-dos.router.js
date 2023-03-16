import express from "express";
import { getDB } from "../db/index.js";
import { validator } from "../middlewares/validator.js";

export const TodosRouter = express.Router();

// C.R.U.D.
TodosRouter.get("/to-dos", async function (request, response) {
    try {
        const db = await getDB();

        const todos = await db.all("SELECT * FROM todos");

        await db.close();

        response.send({ todos });
    } catch (error) {
        response.status(500).send({
            message: "Something went wrong when trying to get to dos.",
            error,
        });
    }
});

TodosRouter.post("/to-do",
    validator,
    async function (request, response) {
    try {
        const { title, description } = request.body;

        const db = await getDB();
        await db.run(`
            INSERT INTO todos (title, description)
                VALUES (
                    '${title}',
                    '${description}'
                )
        `);

        await db.close();

        response.send({ newTodo: {title, description}});

    } catch (error) {
        response.status(500).send({
            message: "Something went wrong when trying to create to dos.",
            error,
        });
    }
});

TodosRouter.patch(
    "/to-do/:id",
    async function (request, response) {
    try {
        const id = request.params.id;
        const db = await getDB();

        const todoExists = await db.run(
            `SELECT * FROM todos WHERE id = ?`,
            id
        );

        if (!todoExists) {
            return response
                .status(404)
                .send({ message: "To-do not found."});
        };

        const { title, description, is_done } = request.body;

        await db.run(
            `UPDATE todos
            SET title = ?, description = ?, is_done = ?
            WHERE id = ?`,
            title || todoExists.title,
            description || todoExists.description,
            is_done !== undefined ? is_done : todoExists.todoExists,
            id
        );

        await db.close();

        response.send({ message: "To-do updated." });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            message: "Something went wrong when trying to update To-dos.",
            error: error
        });
    }
});

TodosRouter.delete("/to-do/:id", async function (request, response) {
    try {
        const id = request.params.id;
        const db = await getDB();

        const todoExists = await db.run(
            `SELECT * FROM todos WHERE id = ?`,
            id
        );

        if (!todoExists) {
            return response
                .status(404)
                .send({ message: "To Do not found."});
        }

        const deleteInfo = await db.run(
            `DELETE FROM todos WHERE id = ?`,
            id
        );

        await db.close();

        response.send({ deleteInfo });
    } catch (error) {
        response.status(500).send({
            message: "Something went wrong when trying to delete a todo.",
            error,
        });
    }
});