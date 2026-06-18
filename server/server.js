import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookies-parser';

dotenv.config();
const app = express();
const port = process.env.PORT || 8088;

app.use(express.json());

app.get('/api', (req, res) => {
    res.send("Student Productivity Automation");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
