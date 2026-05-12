import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.ourGmail,
        pass: config.ourGmailPassword
    }
});

export class NotificationSenderService {
    public static async sendNotification(to: string, categorie: string): Promise<void> {
        try {
            await transporter.sendMail({
                from: config.ourGmail,
                to,
                subject: "testCode",
                text: `${categorie} est remplis`
            });
            console.log("Email sent to " + to);
        } catch (error) {
            console.error("Failed to send email:", error);
        }
    }
}