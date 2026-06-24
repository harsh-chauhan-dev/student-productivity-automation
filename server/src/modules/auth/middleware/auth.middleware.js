import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        // console.log("Cookies:", req.cookies);
    // console.log("Headers:", req.headers.cookie);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token not found",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid or malformed token"
        });
    }
}
