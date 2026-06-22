import pool from "../../../config/db_config.js";
import getTaskProgress from "../utils/taskProgress.js";


// Create Subtask
export const createSubTask = async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  if (!taskId || !title) {
    return res.status(400).json({
      success: false,
      message: "Task ID and title are required",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO subtasks (task_id, title, completed)
      VALUES ($1, $2, false)
      RETURNING *
      `,
      [taskId, title]
    );

    return res.status(201).json({
      success: true,
      subtask: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Subtasks By Task
export const getSubtasks = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({
      success: false,
      message: "Task ID is required",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM subtasks
      WHERE task_id = $1
      ORDER BY created_at ASC
      `,
      [taskId]
    );

    return res.status(200).json({
      success: true,
      subtasks: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Subtask Title
export const updateSubtask = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE subtasks
      SET title = $1
      WHERE id = $2
      RETURNING *
      `,
      [title, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedSubtask: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Toggle Completion + Auto Complete Task
export const toggleSubtask = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE subtasks
      SET completed = $1
      WHERE id = $2
      RETURNING *
      `,
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    const taskId = result.rows[0].task_id;

    const progress = await getTaskProgress(pool, taskId);

    if (
      progress.total > 0 &&
      progress.total === progress.completed
    ) {
      await pool.query(
        `
        UPDATE tasks
        SET
          status = 'completed',
          completed_at = NOW()
        WHERE id = $1
        `,
        [taskId]
      );
    } else {
      await pool.query(
        `
        UPDATE tasks
        SET
          status = 'in_progress',
          completed_at = NULL
        WHERE id = $1
        `,
        [taskId]
      );
    }

    return res.status(200).json({
      success: true,
      subtask: result.rows[0],
      progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Subtask
export const deleteSubtask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM subtasks
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subtask deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};