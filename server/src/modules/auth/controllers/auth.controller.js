import pool from '../../../config/db_config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../../utils/generateToken.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production, false in development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};
// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    // Password validation
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long"
        });
    }

    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
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
            message: "User registered successfully",
            user: newUser.rows[0],
        })
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
}

// Login User

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
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
                message: "Invalid password"
            });
        }
        const payload = {
            id: user.id,
            email: user.email
        }
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await pool.query(
            `UPDATE users
            SET refresh_token = $1
             WHERE id = $2`,
            [refreshToken, user.id]
        );

        res.cookie("token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        const { password_hash ,refresh_token, ...safeUser } = user;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });

    }
}

// Get user Profile

export const getProfile = async (req, res) => {

    try {

        const userID = req.user.id;

        const result = await pool.query(
            `SELECT id,name,email,created_at
             FROM users
             WHERE id = $1`,
            [userID]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Logout User from DB 
export const logoutUser = async (req, res) => {

    try {

        if (req.user?.id) {
            await pool.query(`UPDATE users SET refresh_token = NULL WHERE id=$1`, [req.user.id]);
        }

        res.clearCookie("token");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout Successful"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//  Refresh Token 
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.cookies?.token;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }
        const userResult = await pool.query(`SELECT *FROM users 
            WHERE refresh_token=$1`, [refreshToken]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Inavlid refresh token"
            });
        }
        const user = userResult.rows[0];

        const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const payload = {
            id: user.id,
            email: user.email
        };
        const newAccessToken = generateAccessToken(payload);

        res.cookie("token", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed"
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invaild refresh token"
        });
    }
}