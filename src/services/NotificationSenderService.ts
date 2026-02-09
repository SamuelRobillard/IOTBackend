import nodemailer from "nodemailer";
import config from "../config/config";


export class NotificationSenderService {
    public static async sendNotification( to : string, categorie : string): Promise<void> {
          const transporter =  nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: config.ourGmail, // your email
                pass: config.ourGmailPassword // the app password you generated, paste without spaces
            },
            secure: true,
            port: 465
        });
        (async () => {
          await transporter.sendMail({
          from: config.ourGmail, // your email
          to: to, // the email address you want to send an email to
          subject: "testCode", // The title or subject of the email
          text:  categorie + " est remplis" // I like sending my email as html, you can send \
                   // emails as html or as plain text
        });
        
        console.log("Email sent to " + to);
        })();
        
    }


}