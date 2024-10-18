import React, { useState } from "react";
import axios from "axios";

const TodoItem = ({ todo, dispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(todo.description);

  // Update todo
  const handleUpdate = async (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      try {
        const response = await axios.put(`http://localhost:5000/todos/${todo.todo_id}`, {
          description: input,
        });
        dispatch({ type: "UPDATE_TODO", payload: response.data });
        setIsEditing(false);
      } catch (err) {
        console.error("Error updating todo:", err);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Delete todo
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/todos/${todo.todo_id}`);
      dispatch({ type: "DELETE_TODO", payload: todo.todo_id });
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <tr>
      <td>{formatDate(todo.created_at)}</td> {/* Display formatted date */}
      <td>
        <div className="d-flex justify-content-between align-items-center">
          {isEditing ? (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch({
                    type: "UPDATE_TODO",
                    payload: { ...todo, description: input },
                  });
                  setIsEditing(false);
                }
              }}
              className="form-control w-75"
            />
          ) : (
            <span onClick={() => setIsEditing(true)}>{todo.description}</span>
          )}
          <button className="btn btn-danger btn-sm ml-auto" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TodoItem;
