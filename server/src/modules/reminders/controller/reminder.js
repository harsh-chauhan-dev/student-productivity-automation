import pool from '../../../config/db_config.js';


export const createReminder = async (req, res) => {
    const { task_id, remind_at } = req.body;

    if (!task_id || !remind_at) {
        return res.status(400).json({
            success: false,
            message: "Task ID and remind_at are required"
        });
    }

    try {
        const task = await pool.query(
            `SELECT * FROM tasks
            WHERE id=$1
            AND user_id =$2`, [task_id, req.user.id]
        );
        if (task.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
        }
        
        const result = await pool.query(`INSERT INTO reminders(
            task_id,
            remind_at,
            sent)
            VALUES($1,$2,false)
            RETURNING *`, [task_id, remind_at]);
        
      return res.status(201).json({
        success: true,
        reminder: result.rows[0]
      });
    } catch (error) {
      return res.status(500).json({
      success: false,
      message: error.message
    });
    }
}
    
export const getAllReminders = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        r.*,
        t.title AS task_title
      FROM reminders r
      JOIN tasks t
      ON r.task_id = t.id
      WHERE t.user_id = $1
      ORDER BY r.remind_at ASC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      reminders: result.rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getReminderById = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT
        r.*,
        t.title AS task_title
      FROM reminders r
      JOIN tasks t
      ON r.task_id = t.id
      WHERE r.id = $1
      AND t.user_id = $2
      `,
      [id, req.user.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"Reminder not found"
      });
    }

    return res.status(200).json({
      success:true,
      reminder:result.rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}; 

 export const deleteReminder = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      `
      DELETE FROM reminders
      WHERE id IN (
        SELECT r.id
        FROM reminders r
        JOIN tasks t
        ON r.task_id = t.id
        WHERE r.id = $1
        AND t.user_id = $2
      )
      RETURNING *
      `,
      [id, req.user.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"Reminder not found"
      });
    }

    return res.status(200).json({
      success:true,
      message:"Reminder deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};