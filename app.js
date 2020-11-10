const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db');
const formatDate = require('./date');
app.use(express.json());



//GET ALL TODOS
app.get("/todos", async(req, res) => {
    try {
        let { start_date, end_date } = req.query;
        if (!start_date || !end_date) {
            start_date = formatDate(new Date());
            end_date = formatDate(new Date());
        }
        //
        const allTodos = await pool.query("SELECT * FROM todo WHERE posting_date BETWEEN $1 AND $2 AND is_active = true ORDER BY todo_id desc", [start_date, end_date]);
        res.json(allTodos.rows);
    } catch (e) {
        console.log(e.message)
    }
});

//GET A TODO BY ID
app.get("/todos/:ID", async(req, res) => {
    try {
        const { ID } = req.params;
        //WHERE posting_date BETWEEN ($1) AND $(2)" [start_date, end_date]
        const allTodos = await pool.query("SELECT * FROM todo WHERE todo_id = $1 AND is_active = true", [ID]);
        res.json(allTodos.rows[0]);
    } catch (e) {
        console.log(e.message)
    }
});

//UPDATE
app.put("/todos/:ID", async(req, res) => {
    try {
        const { ID } = req.params;
        const { description } = req.body;
        //WHERE posting_date BETWEEN ($1) AND $(2)" [start_date, end_date]
        const allTodos = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *", [description, ID]);
        res.json(allTodos.rows[0]);
    } catch (e) {
        console.log(e.message)
    }
});
//DELETE
app.put("/todos/update/:ID", async(req, res) => {
    try {
        const { ID } = req.params;
        //WHERE posting_date BETWEEN ($1) AND $(2)" [start_date, end_date]
        const allTodos = await pool.query("UPDATE todo SET is_active = false WHERE todo_id = $1 RETURNING *", [ID]);
        res.json(allTodos.rows[0]);
    } catch (e) {
        console.log(e.message)
    }
});
//CREATE TODO
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    } catch (e) {
        console.log(e.message)
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})