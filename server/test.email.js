import { sendEmail } from "./src/services/email.service.js";
import { reminderTemplate } from "./src/template/reminder.template.js";

await sendEmail({
    to: "diwanshuchauhan2@gmail.com",
    subject: "📚 Task Reminder",
    html: reminderTemplate({
        username: "Divanshu",
        taskTitle: "Complete Backend Reminder Module",
        dueDate: "27 June 2026, 6:00 PM",
    }),
});