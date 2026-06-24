import cron from 'node-cron';
import pool from '../../config/db_config.js';


const startReminderJob = () => {
    cron.schedule('* * * * *', async () => {
        console.log("Cheking reminder....");
        try {
            const reminders = await pool.query(
                `SELECT 
                r.id,
                r.task_id,
                t.user_id,
                t.title
                FROM reminders r
                JOIN tasks t
                ON r.task_id=t.id
                WHERE 
                r.sent = false
                AND 
                r.remind_at<=NOW()`
            );

            for (const reminder of reminders.rows) {
                await pool.query(`INSERT INTO notifications(user_id,title,message)
                    VALUES($1,$2,$3)`,
                    [
                        reminder.user_id,
                        "Task Reminder",
                        `${reminder.title} is due soon`
                    ]
                );

                await pool.query(
                    `UPDATE reminders
                    SET sent = true
                    WHERE id = $1`,
                    [reminder.id]
                );
                console.log(
                    `Reminder processed: ${reminder.id}`
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    });
};


export default startReminderJob;