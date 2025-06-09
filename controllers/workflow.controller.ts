import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import { WorkflowContext } from '@upstash/workflow';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context: WorkflowContext) => {
    const { subscriptionId } = context.requestPayload as { subscriptionId: string };
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        const currentDate = dayjs();

        if (reminderDate.isAfter(currentDate)) {
            await sleepUntilReminder(context, `Sleep until ${daysBefore} days before renewal`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
})

const fetchSubscription = async (context: WorkflowContext, subscriptionId: string) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async (context: WorkflowContext, label: string, date: dayjs.Dayjs) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate())
}

const triggerReminder = async (context: WorkflowContext, label: string, subscription: any) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder for subscription ${subscription._id}`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    })
}