import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    number: {
        type: String,
        trim: true,
        required: true,
        minlength: 10,
        maxlength: 10
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
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }

}, { timestamps: true })

const UserModel = model('User', userSchema)
export default UserModel
