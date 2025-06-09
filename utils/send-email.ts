import dayjs from "dayjs";
import { emailTemplates, EmailTemplateData } from "./email-template.js";
import { accountEmail, transporter } from "../config/nodemailer.js";

interface SubscriptionData {
    name: string;
    price: number;
    frequency: string;
    currency: string;
    renewalDate: Date;
    paymentMethod: string;
    user: {
        name: string;
        email: string;
    };
}

interface SendReminderEmailParams {
    to: string;
    type: string;
    subscription: SubscriptionData;
}

export const sendReminderEmail = async ({ to, type, subscription }: SendReminderEmailParams): Promise<void> => {
    if (!to || !type || !subscription) {
        throw new Error("Missing required parameters: to, type, or subscription");
    }

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) {
        const errorMessage = `Email template not found for type: ${type}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const mailInfo: EmailTemplateData = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    };

    const subject = template!.generateSubject(mailInfo);
    const message = template!.generateBody(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error to be caught by the workflow
    }
};