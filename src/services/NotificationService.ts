import nodemailer from "nodemailer";



export class NotificationService {
    public static async createAdmin(){
          const transporter =  nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "", // your email
                pass: "nbrp voia bjop laoo" // the app password you generated, paste without spaces
            },
            secure: true,
            port: 465
        });
        (async () => {
          await transporter.sendMail({
          from: "", // your email
          to: "", // the email address you want to send an email to
          subject: "testCode", // The title or subject of the email
          text: "bai bref c'est un test" // I like sending my email as html, you can send \
                   // emails as html or as plain text
        });
        
        console.log("Email sent");
        })();
        
    }


}