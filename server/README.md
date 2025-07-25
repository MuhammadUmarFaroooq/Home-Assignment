# Task Management API

A comprehensive task management backend system built with Node.js, Express, and MongoDB. This API provides user authentication, task CRUD operations, file uploads, and advanced filtering capabilities.

## Features

- **User Authentication**: Registration, login, password reset
- **Task Management**: Full CRUD operations for tasks
- **Advanced Filtering**: Filter tasks by status, priority, assignee
- **Search Functionality**: Search tasks and users
- **File Upload**: AWS S3 integration for task attachments
- **User Management**: User search and profile management

## Database Schema

### Users Table
```javascript
{
  id: ObjectId,
  email: String (unique),
  name: String,
  password: String (hashed),
  created_at: Date,
  updated_at: Date
}
```

### Tasks Table
```javascript
{
  id: ObjectId,
  title: String (required, min 3 chars),
  description: String (optional),
  status: 'todo' | 'in_progress' | 'done',
  priority: 'low' | 'medium' | 'high',
  assignee_id: ObjectId (ref: User),
  due_date: Date,
  attachment_url: String (optional),
  created_by: ObjectId (ref: User),
  created_at: Date,
  updated_at: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgotPassword` - Send password reset token
- `PATCH /api/auth/resetPassword` - Reset password with token

### Users
- `GET /api/users` - Get all users (with pagination & search)
- `GET /api/users/search?q=query` - Search users by name/email
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering & pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks/:id/upload` - Upload attachment to task

### File Upload
- `POST /api/upload` - Upload files to AWS S3

## Query Parameters

### Tasks Filtering
- `status` - Filter by task status (todo, in_progress, done)
- `priority` - Filter by priority (low, medium, high)
- `assignee_id` - Filter by assignee user ID
- `myTasks=true` - Show only tasks assigned to current user
- `search` - Search in title and description
- `sort` - Sort results (e.g., 'due_date', '-created_at')
- `page` - Page number for pagination
- `limit` - Number of results per page

### Users Search
- `q` - Search query for name or email

## Request/Response Examples

### Register User
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Create Task
```javascript
POST /api/tasks
Authorization: Bearer jwt_token

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "assignee_id": "user_id_here",
  "due_date": "2025-01-30T00:00:00.000Z"
}

Response:
{
  "status": "success",
  "data": {
    "task": {
      "id": "task_id",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "todo",
      "priority": "high",
      "assignee_id": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "due_date": "2025-01-30T00:00:00.000Z",
      "created_at": "2025-01-18T00:00:00.000Z"
    }
  }
}
```

### Get Tasks with Filtering
```javascript
GET /api/tasks?status=todo&priority=high&page=1&limit=10&sort=-created_at
Authorization: Bearer jwt_token

Response:
{
  "status": "success",
  "results": 5,
  "total": 25,
  "data": {
    "tasks": [
      // array of task objects
    ]
  }
}
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure MongoDB**
   - Update `MONGO_URI` in `.env` with your MongoDB connection string
   - Use provided credentials: `mumarfarooqfab@gmail.com` / `AskSami123@!@!`

5. **Configure JWT**
   - Set a secure `JWT_SECRET` in `.env`

6. **Configure AWS S3 (for file uploads)**
   - Set your AWS credentials in `.env`

7. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

Required environment variables (see `.env.example`):

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration time
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `AWS_ACCESS_KEY_ID1` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY1` - AWS secret key for S3
- `AWS_STORAGE_BUCKET_NAME` - S3 bucket name
- `REGION` - AWS region

## Task Status Flow

Tasks follow this status progression:
1. `todo` - Initial state when task is created
2. `in_progress` - Task is being worked on
3. `done` - Task is completed

## Priority Levels

- `low` - Low priority tasks
- `medium` - Medium priority tasks (default)
- `high` - High priority tasks

## Authentication

All API endpoints except registration and login require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "status": "fail",
  "message": "Error description",
  "error": {
    "field_name": "Field-specific error message"
  }
}
```

## File Upload

Files are uploaded to AWS S3. The upload endpoint returns the file URL which can be used as `attachment_url` for tasks.

## Development

- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **AWS S3** - File storage
- **Multer** - File upload handling
