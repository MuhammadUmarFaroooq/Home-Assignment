// components/TaskCard.tsx
import React from "react";
import { FiPaperclip } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { users, type Task } from "../utils/task";
import { Avatar } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { useDeleteTaskMutation } from "../api/apiComponents/taskApi";
import Loader from "./Loader/Loader";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const dueDate = new Date(task.due_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId).unwrap();
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-grab hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(task._id);
          }}
          className="text-red-400 hover:text-red-600 cursor-pointer"
        >
          <MdDelete size={20} />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar
            sx={{
              bgcolor: "skyblue",
              width: 32,
              height: 32,
              fontSize: 14,
            }}
          >
            {task?.assignee_id?.name?.charAt(0)}
          </Avatar>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {task.attachment_url && (
            <a
              href={task.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiPaperclip />
            </a>
          )}
          <span className="text-xs text-gray-500">{dueDate}</span>
        </div>
      </div>

      <Loader loading={isLoading} />
    </div>
  );
};

export default TaskCard;
