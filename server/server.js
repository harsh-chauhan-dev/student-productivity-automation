import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './src/config/db_config.js';
import authRouter from './src/modules/auth/routes/auth.routes.js';
import { errorHandler, notFoundHandler } from './src/middleware/error.handler.js';
import subjectRoute from './src/modules/subject/router/subjectRouter.js';
import  taskRoute  from './src/modules/Task/router/TaskRoute.js';
import subtaskRoute from './src/modules/subtask/route/subtaskRoute.js';
import { NotesRoute } from './src/modules/Notes/index.js';
import { StudySessionRoute } from './src/modules/Study_session/index.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration (if frontend is on different port)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRouter);
app.use('/api/subject', subjectRoute);
app.use('/api/task', taskRoute);
app.use('/api/subtasks', subtaskRoute);
app.use('/api/notes', NotesRoute);
app.use('/api/session', StudySessionRoute);
// ==================== TEST DATABASE CONNECTION ====================
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            success: true,
            message: 'Database connection successful',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// ==================== ERROR HANDLING ====================
// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

// ==================== SERVER STARTUP ====================
const startServer = async () => {
    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('✓ Database connected successfully');

        app.listen(port, () => {
            console.log(`
╔══════════════════════════════════════════════════════╗
║  Student Productivity Automation Server               ║
╠══════════════════════════════════════════════════════ ╣
║  Status: Running ✓                                    ║
║  Port: ${port}                                        ║
║  Environment: ${process.env.NODE_ENV || 'development'}║
║  API Base URL: http://localhost:${port}/api           ║
║  Health Check: http://localhost:${port}/health        ║
║  DB Test: http://localhost:${port}/api/db-test        ║
╚══════════════════════════════════════════════════════ ╝
            `);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
