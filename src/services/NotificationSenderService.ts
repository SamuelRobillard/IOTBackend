import sgMail from '@sendgrid/mail';
import config from "../config/config";

sgMail.setApiKey(config.SENDGRID_API_KEY);

export class NotificationSenderService {
    public static async sendNotification(to: string, categorie: string) {
        try {
            await sgMail.send({
                to,
                from: config.SENDGRID_SENDER_EMAIL,
                subject: 'testCode',
                text: `${categorie} est remplis`,
            });
            console.log("Email sent to " + to);
        } catch (err) {
            console.error("Failed to send email:", err);
        }
    }
}