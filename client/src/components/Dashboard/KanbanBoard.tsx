
import React, { useState } from "react";
import type { Task } from "../../utils/task";
import TaskCard from "../TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onEditTask: (task: Task) => void;
}

const statusTitles = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskStatusChange,
  onEditTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (status: Task["status"]) => {
    if (draggedTaskId) {
      onTaskStatusChange(draggedTaskId, status);
    }
    setDraggedTaskId(null);
  };

  const filteredTasks = (status: Task["status"]) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(statusTitles).map(([status, title]) => (
        <div
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(status as Task["status"])}
          className="bg-gray-50 rounded-lg p-3"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">{title}</h2>
            <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredTasks(status as Task["status"]).length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTasks(status as Task["status"]).map((task) => (
              <div
                key={task.id}
                onClick={() => onEditTask(task)}
                className="cursor-pointer"
              >
                <TaskCard task={task} onDragStart={handleDragStart} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
