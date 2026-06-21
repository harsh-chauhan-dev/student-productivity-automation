import pool from '../../../config/db_config.js';


// Create Task 
export const createTask = async (req, res) => {
    const { title, status, priority, description, due_date, estimated_minutes, subject_id } = req.body;

    if (!title || !subject_id) {
        return res.status(401).json({
            success: false,
            message: "title and subject are required"
        });
    }
    try {
        const subject = await pool.query(`SELECT * FROM subjects WHERE id=$1 AND user_id=$2`, [subject_id, req.user.id]);
        if (subject.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        const result = await pool.query(`INSERT INTO tasks (user_id,subject_id,title,description,priority,status,due_date,estimated_minutes) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [req.user.id, subject_id, title, description, priority || "medium", status || "pending", due_date, estimated_minutes]);

        return res.status(201).json({
            success: true,
            message: "Task create successfull",
            task: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
   
// Get All Task
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
    s.name AS subject_name
FROM tasks t
INNER JOIN subjects s
ON t.subject_id = s.id
WHERE t.user_id = $1
ORDER BY t.created_at DESC;`, [req.user.id]);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            task: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get Task by Id
export const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
        
          return res.status(200).json({
            success: true,
            task: result.rows[0],
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Update Task
export const updateTask = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    priority,
    status,
    estimated_minutes,
    due_date,
    subject_id,
  } = req.body;

    try {
      const subject = await pool.query(
  `SELECT * FROM subjects
   WHERE id=$1 AND user_id=$2`,
  [subject_id, req.user.id]
);

if (subject.rows.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Subject not found",
  });
}

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        priority = $3,
        status = $4,
        estimated_minutes = $5,
        due_date = $6,
        subject_id = $7,
        updated_at = NOW()
      WHERE id = $8
      AND user_id = $9
      RETURNING *;
      `,
      [
        title,
        description,
        priority,
        status,
        estimated_minutes,
        due_date,
        subject_id,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Task
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: true,
            message: "ID is required"
        });
    }
    try {
        const result = await pool.query(`DELETE FROM tasks WHERE id = $1 AND 
user_id= $2 RETURNING *`, [id, req.user.id]);
       
      if (result.rows.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Task not found",
  });
}

return res.status(200).json({
  success: true,
  message: "Task deleted successfully",
});
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}