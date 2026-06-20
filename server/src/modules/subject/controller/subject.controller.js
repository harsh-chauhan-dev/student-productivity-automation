import pool from '../../../config/db_config.js';

export const createSubject = async (req, res) => {
    const { name, color_hex, target_hours_per_week } = req.body;
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Suject name is required"
        });
    }
    try {
        const result = await pool.query(
            'INSERT INTO subjects (user_id,name,color_hex,target_hours_per_week) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.id, name, color_hex, target_hours_per_week]
        );
        return res.status(201).json({
            success: true,
            subject: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getAllSubject = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subjects WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            subjects: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message
        });
    }
}

export const getSubjectById = async (req, res) => {
    const { id } = req.params.id;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: "Id is required"
        });
    }
    try {
        const result = await pool.query('SELECT * FROM subjects WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);

        return res.status(200).json({
            success: true,
            subjectId: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message
        });
    }
}

export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { name, color_hex, target_hours_per_week } = req.body;

    try {
        const result = await pool.query(`UPDATE subjects
SET
    name = $1,
    color_hex = $2,
    target_hours_per_week = $3
WHERE id = $4
AND user_id = $5
RETURNING *;`,
            [name, color_hex, target_hours_per_week, id, req.user.id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            subject: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`DELETE FROM subjects WHERE id = $1 AND 
user_id= $2 RETURNING *`, [id, req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Subject deleted succefully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}