const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      minlength: [3, 'Task title must be at least 3 characters long'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    assignee_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assignee is required']
    },
    due_date: {
      type: Date,
      required: [true, 'Due date is required']
    },
    attachment_url: {
      type: String,
      trim: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignee_id: 1 });
taskSchema.index({ due_date: 1 });
taskSchema.index({ created_at: -1 });

// Populate assignee information
taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'assignee_id',
    select: 'name email'
  }).populate({
    path: 'created_by',
    select: 'name email'
  });
  next();
});

const Task = model('Task', taskSchema);

module.exports = Task;
