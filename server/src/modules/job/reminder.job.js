import cron from "node-cron";
import pool from "../../config/db_config.js";
import { sendEmail } from "../../services/email.service.js";
import { reminderTemplate } from "../../template/reminder.template.js";

const startReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Cheking reminder....");
    try {
      const reminders = await pool.query(
        `
                SELECT
    r.id,
    r.remind_at,

    t.title,

    u.id AS user_id,
    u.name,
    u.email

FROM reminders r

JOIN tasks t
ON r.task_id = t.id

JOIN users u
ON t.user_id = u.id

WHERE
    r.sent = false
    AND r.remind_at <= NOW();
                `,
      );

      for (const reminder of reminders.rows) {
        try {
          await sendEmail({
            to: reminder.email,
            subject: "📚 Task Reminder",
            html: reminderTemplate({
              username: reminder.name,
              taskTitle: reminder.title,
              dueDate: reminder.remind_at,
            }),
          });

          await pool.query(
            `INSERT INTO notifications(user_id,title,message)
                    VALUES($1,$2,$3)`,
            [
              reminder.user_id,
              "Task Reminder",
              `${reminder.title} is due soon`,
            ],
          );

          await pool.query(
            `UPDATE reminders
                    SET sent = true
                    WHERE id = $1`,
            [reminder.id],
          );
          console.log(`Reminder processed: ${reminder.id}`);
        } catch (error) {
          console.log(error.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  });
};

export default startReminderJob;
