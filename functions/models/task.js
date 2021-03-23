const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    taskCategory: {
        type: String,
        required: true,
    },
    plannedHours: {
        type: Number,
        required: true,
    },
    actualHours: {
        type: Number,
        required: true,
    },
    taskDate: {
        type: Date
    },
    taskId: {
        type: String
    }
})


module.exports = mongoose.model('Task', taskSchema)