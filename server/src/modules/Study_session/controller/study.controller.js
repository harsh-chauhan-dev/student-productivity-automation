import pool from '../../../config/db_config.js';

export const startStudySession = async (req, res) => {
    const userId = req.user.id;
    const { subject_id, task_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO study_sessions(user_id, subject_id, task_id, started_at)
             VALUES($1, $2, $3, NOW())
             RETURNING *`,
            [userId, subject_id || null, task_id || null]
        );

        const sessionData = result.rows[0];
        return res.status(201).json({
            success: true,
            message: "Study session started successfully",
            data: sessionData,
            session: sessionData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const endStudySession = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const sessionResult = await pool.query(
            `SELECT * FROM study_sessions WHERE id =$1 AND user_id = $2`,
            [id, userId]
        );
        if (sessionResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const session = sessionResult.rows[0];
        if (session.ended_at) {
            return res.status(400).json({
                success: false,
                message: "Session already ended"
            });
        }

        const endTime = new Date();
        const durationMinutes = Math.floor(
            (endTime - new Date(session.started_at)) / (1000 * 60)
        );

        const result = await pool.query(
            `UPDATE study_sessions SET ended_at=NOW(), duration_minutes=$1 WHERE id=$2 RETURNING *`,
            [durationMinutes || 25, id]
        );

        const sessionData = result.rows[0];
        return res.status(200).json({
            success: true,
            message: "Session ended successfully",
            data: sessionData,
            session: sessionData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllSessions = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM study_sessions WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
            sessions: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getSessionById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM study_sessions WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const sessionData = result.rows[0];
        return res.status(200).json({
            success: true,
            data: sessionData,
            session: sessionData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteSession = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `DELETE FROM study_sessions WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Session deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};