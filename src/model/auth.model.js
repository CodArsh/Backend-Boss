import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid Email!'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    image: { type: String },     // path or URL
    bio: { type: String },
    mobile: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String }

}, { timestamps: true })

const UserModel = model('User', userSchema)
export default UserModel
