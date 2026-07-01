import pool from '../../../config/db_config.js';

// Create Task 
export const createTask = async (req, res) => {
    const { title, status, priority, description, due_date, estimated_minutes, subject_id } = req.body;

    if (!title || !subject_id) {
        return res.status(400).json({
            success: false,
            message: "Title and course subject are required"
        });
    }
    try {
        const subject = await pool.query(`SELECT * FROM subjects WHERE id=$1 AND user_id=$2`, [subject_id, req.user.id]);
        if (subject.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Selected subject not found in your database"
            });
        }
        const validDueDate = due_date && due_date.trim() !== "" ? due_date : new Date().toISOString().split("T")[0];
        const result = await pool.query(
            `INSERT INTO tasks (user_id, subject_id, title, description, priority, status, due_date, estimated_minutes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.user.id, subject_id, title, description || "", priority || "medium", status || "pending", validDueDate, Number(estimated_minutes) || 30]
        );
        const taskData = result.rows[0];
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: taskData,
            task: taskData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Tasks
export const getAllTask = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                t.id,
                t.title,
                t.description,
                t.priority,
                t.status,
                t.due_date,
                t.estimated_minutes,
                t.subject_id,
                s.name AS subject_name
            FROM tasks t
            INNER JOIN subjects s ON t.subject_id = s.id
            WHERE t.user_id = $1
            ORDER BY t.created_at DESC;`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
            task: result.rows,
            tasks: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Task by Id
export const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT t.*, s.name AS subject_name FROM tasks t INNER JOIN subjects s ON t.subject_id = s.id WHERE t.id=$1 AND t.user_id=$2`,
            [id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        const taskData = result.rows[0];
        return res.status(200).json({
            success: true,
            data: taskData,
            task: taskData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, estimated_minutes, due_date, subject_id } = req.body;

    try {
        if (subject_id) {
            const subject = await pool.query(`SELECT * FROM subjects WHERE id=$1 AND user_id=$2`, [subject_id, req.user.id]);
            if (subject.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Subject not found"
                });
            }
        }

        const validDueDate = due_date && due_date.trim() !== "" ? due_date : new Date().toISOString().split("T")[0];

        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 priority = COALESCE($3, priority),
                 status = COALESCE($4, status),
                 estimated_minutes = COALESCE($5, estimated_minutes),
                 due_date = COALESCE($6, due_date),
                 subject_id = COALESCE($7, subject_id),
                 updated_at = NOW()
             WHERE id = $8 AND user_id = $9
             RETURNING *;`,
            [title, description, priority, status, estimated_minutes, validDueDate, subject_id, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        const taskData = result.rows[0];
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: taskData,
            task: taskData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Task
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Task ID is required"
        });
    }
    try {
        const result = await pool.query(`DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`, [id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};