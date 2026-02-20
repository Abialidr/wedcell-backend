const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, },
    completed: { type: Boolean, required: true },
    category: { type: String, required: true },
    dueDate: { type: String, required: true },
    completedOn: { type: String, required: false, default: '' },
  },
  { timestamps: true }
);
module.exports = mongoose.model('todo', todoSchema);
