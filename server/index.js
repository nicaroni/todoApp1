const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allow JSON request bodies

// Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const result = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.status(201).json(result.rows[0]); // Send the created todo back with status 201
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo ORDER BY todo_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a single todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" }); // Handle case where the todo doesn't exist
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const result = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
      [description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM todo WHERE todo_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted!", deletedTodo: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
