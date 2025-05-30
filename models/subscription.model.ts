import mongoose from 'mongoose';

interface Subscription extends mongoose.Document {
    name: string;
    price: number;
    currency: 'USD' | 'NGN' | 'GBP' | 'EUR';
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    category: 'sports' | 'news' | 'entertainment' | 'lifestyle' | 'technology' | 'finance' | 'politics' | 'other';
    paymentMethod: string;
    status: 'active' | 'cancelled' | 'expired';
    startDate: Date;
    renewalDate?: Date;
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<Subscription>({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subcsription price is required'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'NGN', 'GBP', 'EUR'],
        default: 'NGN',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true,
    },
    category: {
        type: String,
        required: [true, 'Subscription category is required'],
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value: Date) => value <= new Date(),
            message: 'Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (this: Subscription, value: Date) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true })

// Set the renewal date if not already set
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if (this.renewalDate! < new Date()) {
        this.status = 'expired';
    }

    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription;