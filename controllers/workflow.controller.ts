import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import { WorkflowContext } from '@upstash/workflow';
import Subscription from '../models/subscription.model.js';

const REMINDERS = [7, 5, 3, 1];

export const sendReminders = serve(async (context: WorkflowContext) => {
    const { subscriptionId } = context.requestPayload as { subscriptionId: string };
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Subscription ${subscriptionId} is already expired. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder for ${daysBefore} days before renewal`, reminderDate);
        }

        await triggerReminder(context, `Reminder for ${daysBefore} days before renewal`);
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

const triggerReminder = async (context: WorkflowContext, label: string) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
        // Send email, SMS or notification logic
    })
}