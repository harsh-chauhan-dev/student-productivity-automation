import pool from '../../../config/db_config.js';

export const createNotes = async (req, res) => {
    const userId = req.user.id;
    const { subject_id, title, content } = req.body;

    if (!subject_id || !title || !content) {
        return res.status(400).json({
            success: false,
            message: "Subject, title, and content are required"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO notes(user_id, subject_id, title, content) VALUES($1, $2, $3, $4) RETURNING *`,
            [userId, subject_id, title, content]
        );
        const noteData = result.rows[0];
        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: noteData,
            note: noteData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllNotes = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT n.*, s.name AS subject_name FROM notes n INNER JOIN subjects s ON n.subject_id = s.id WHERE n.user_id=$1 ORDER BY n.updated_at DESC`,
            [userId]
        );
        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
            notes: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getNoteById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Note ID is required"
        });
    }

    try {
        const result = await pool.query(`SELECT * FROM notes WHERE id=$1 AND user_id=$2`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        const noteData = result.rows[0];
        return res.status(200).json({
            success: true,
            data: noteData,
            note: noteData,
            notes: noteData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: "Title and content are required"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *`,
            [title, content, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        const noteData = result.rows[0];
        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: noteData,
            note: noteData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(`DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const searchNotes = async (req, res) => {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({
            success: false,
            message: "Search query is required"
        });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM notes WHERE user_id = $1 AND (title ILIKE $2 OR content ILIKE $2) ORDER BY updated_at DESC`,
            [userId, `%${q}%`]
        );
        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
            notes: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};