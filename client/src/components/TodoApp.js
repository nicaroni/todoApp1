import React, { useReducer, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import todoReducer, { initialState } from "./TodoReducer";
import axios from "axios";

const TodoApp = () => {
  const [todos, dispatch] = useReducer(todoReducer, initialState);

  // Fetch all todos from the server on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        dispatch({ type: "SET_TODOS", payload: response.data });
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">Todo App</h1>
      <TodoForm dispatch={dispatch} />
      <TodoList todos={todos} dispatch={dispatch} />
    </div>
  );
};

export default TodoApp;
