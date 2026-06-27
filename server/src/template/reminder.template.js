export const reminderTemplate = ({
    username,
    taskTitle,
    dueDate,
}) => {
    return `
    <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        background-color: #fafafa;
    ">

        <h2 style="color:#2563eb;">
            📚 Student Productivity Automation
        </h2>

        <p>Hello <strong>${username}</strong>,</p>

        <p>
            This is a reminder that one of your tasks is due soon.
        </p>

        <div style="
            background:#ffffff;
            border:1px solid #ddd;
            padding:15px;
            border-radius:8px;
            margin:20px 0;
        ">
            <h3 style="margin:0;color:#111827;">
                ${taskTitle}
            </h3>

            <p style="margin-top:10px;">
                <strong>Due Date:</strong> ${dueDate}
            </p>
        </div>

        <p>
            Stay focused, stay consistent, and keep learning. 🚀
        </p>

        <hr>

        <p style="
            color:#6b7280;
            font-size:13px;
        ">
            This email was sent automatically by
            Student Productivity Automation.
        </p>

    </div>
    `;
};