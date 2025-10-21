import { Schema, model } from "mongoose";

const taskSchema = Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    taskname: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    assign_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "hold", "completed"],
        default: "pending"
    }
}, { timestamps: true })


taskSchema.pre('save', async function (next) {
    try {
        if (this.assign_date && typeof this.assign_date === 'string') {
            const [day, month, year] = this.assign_date.split('-')
            if (day && month && year) {
                const parsedDate = new Date(`${year}-${month}-${day}`)
                if (!isNaN(parsedDate)) {
                    this.assign_date = parsedDate.toISOString()
                }
            }
        }

        next()
    } catch (err) {
        next(err)
    }
})

const TaskModel = model('task', taskSchema)
export default TaskModel