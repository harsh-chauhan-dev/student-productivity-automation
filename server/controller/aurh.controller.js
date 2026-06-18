import pool from '../config/db_config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generatAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'none'
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are requied"
        });
    }
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User alredy exist"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            `INSERT INTO users (name, email, password_hash)
               VALUES ($1, $2, $3)
               RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            messsage: "User Registre successfully",
            user: newUser.rows[0],
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields are required"
        });
    }
    try {
        const existUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (existUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Email does not exist"
            });
        }

        const user = existUser.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invaild password"
            });
        }
        const payload = {
            id: user.id,
            email: user.email
        }
        const accessToken =generatAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        const { password_hash: _, ...safeUser } = user;

        res.status(200).json({
            success: true,
            message: "Login Succssful",
            user: safeUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}