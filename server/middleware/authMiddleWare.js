import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = async (req, res, next) => {
    const token = req.cookies?.token;
    
    console.log("Token: ", token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token does not exist",
        });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}