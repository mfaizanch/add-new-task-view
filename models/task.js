const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { maxDepth: 1 },
    },
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    taskStatus: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false
    },


    createdAt: { type: Date, default: Date.now },
})

TaskSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('Task', TaskSchema)
