import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './router/authRouter.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 8088;
app.use(cookieParser());
app.use(express.json());

// app.get('/api', (req, res) => {
    // res.send("Student Productivity Automation");
// });
app.use('/api', authRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
