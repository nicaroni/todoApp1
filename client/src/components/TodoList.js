import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, dispatch }) => {
  return (
    <div>
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>Created At</th> 
            <th>Description</th>
            
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <TodoItem key={todo.todo_id} todo={todo} dispatch={dispatch} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
