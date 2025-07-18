const Joi = require('joi');

const taskCreateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Task title must be at least 3 characters long',
      'string.max': 'Task title cannot exceed 200 characters',
      'any.required': 'Task title is required'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  status: Joi.string()
    .valid('todo', 'in_progress', 'done')
    .default('todo')
    .messages({
      'any.only': 'Status must be one of: todo, in_progress, done'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
  
  assignee_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Assignee ID must be a valid MongoDB ObjectId',
      'any.required': 'Assignee is required'
    }),
  
  due_date: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'Due date cannot be in the past',
      'any.required': 'Due date is required'
    }),
  
  attachment_url: Joi.string()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Attachment URL must be a valid URL'
    })
});

const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Task title must be at least 3 characters long',
      'string.max': 'Task title cannot exceed 200 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  status: Joi.string()
    .valid('todo', 'in_progress', 'done')
    .messages({
      'any.only': 'Status must be one of: todo, in_progress, done'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
  
  assignee_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Assignee ID must be a valid MongoDB ObjectId'
    }),
  
  due_date: Joi.date()
    .messages({
      'date.base': 'Due date must be a valid date'
    }),
  
  attachment_url: Joi.string()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Attachment URL must be a valid URL'
    })
});

module.exports = {
  taskCreateSchema,
  taskUpdateSchema
};
