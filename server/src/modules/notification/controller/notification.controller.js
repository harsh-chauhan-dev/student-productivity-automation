import pool from '../../../config/db_config.js';

export const getAllNotifications = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      notifications: result.rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getNotificationById = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE id = $1
      AND user_id = $2
      `,
      [id, req.user.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"Notification not found"
      });
    }

    return res.status(200).json({
      success:true,
      notification:result.rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

    export const markAsRead = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, req.user.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"Notification not found"
      });
    }

    return res.status(200).json({
      success:true,
      notification:result.rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

export const deleteNotification = async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, req.user.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"Notification not found"
      });
    }

    return res.status(200).json({
      success:true,
      message:"Notification deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};