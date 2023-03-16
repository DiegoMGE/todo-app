import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";
import { getToDo } from "./API.js";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const refreshToDo = async () => {
    const todos = await getToDo();
    setTodos(todos);
  };

  useEffect(() => {
    getToDo().then((todos) => {
      setTodos(todos);
    });
  }, []);

  const addTodo = async (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      return;
    }
    const newToDo = await axios.post("http://localhost:3000/v1/to-do", todo);
    refreshToDo();
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }

    const updatedTodo = await axios.patch(
      `http://localhost:3000/v1/to-do/${todoId}`,
      newValue
    );
    refreshToDo();
  };

  const removeTodo = async (id) => {
    const removeTodo = await axios.delete(
      `http://localhost:3000/v1/to-do/${id}`
    );

    refreshToDo();
  };

  const completeTodo = async (id) => {
    const [todoFound] = todos.filter((todo) => todo.id === id);
    await axios.patch(`http://localhost:3000/v1/to-do/${id}`, {
      is_done: todoFound.is_done === 0 ? 1 : 0,
    });

    refreshToDo();
  };

  return (
    <>
      <h1>Awesome, it's Thursday 🤗</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
