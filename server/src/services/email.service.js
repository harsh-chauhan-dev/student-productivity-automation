import transporter from "../config/email.config.js";

export const sendEmail = async({
    to,
    subject,
   html
}) => {
    const info = await transporter.sendMail({
        from: `"Student Productivity Automation"<${process.env.EMAIL_USER}`,
        to,
        subject,
        html
    });
    console.log("Email send: ", info.messageId);
    return info;
}

