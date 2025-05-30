import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 6 characters long'],
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User;