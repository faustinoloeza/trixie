# TODO CRUD EXPRESS AND POSTGRESQL

#### Operaciones

Crear

Solo recibe una descripción y se pone por default una fecha de creación y un status.

```js
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    } catch (e) {
        console.log(e.message)
    }
});
```

Obtener toda la información filtrando por rango de fecha y si se encuentra activo.

```js
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
```

Obtener por ID

```js
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
```

Actualizar

```js
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
```

Eliminar que es actualizar si se encuentra activo o no

```
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
```

SQL

```sql
CREATE DATABASE my_database;


CREATE TABLE IF NOT EXISTS todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    posting_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true
)
```

Librerías

```
"dotenv": "^8.2.0",
"express": "^4.17.1",
"pg": "^8.4.2"
```

