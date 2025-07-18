// pages/Dashboard.tsx
import React, { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { mockTasks, type Task } from "../../utils/task";
import KanbanBoard from "../../components/Dashboard/KanbanBoard";
import TaskModal from "../../components/Modals/TaskModal";
import { FilterButton } from "../../components/button/FilterButton";
import { useFileUploader } from "../../hooks/useFileUploader";
import Loader from "../../components/Loader/Loader";
import {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "../../api/apiComponents/taskApi";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { uploadFile, uploadProgress, isLoading } = useFileUploader();

  const [filters, setFilters] = useState<{
    status?: Task["status"][];
    priority?: Task["priority"][];
    assignee_id?: string[];
  }>({});

  const { data, isLoading: isLoadingTasks } = useGetAllTasksQuery({
    status: filters.status,
    priority: filters.priority,
    assignee_id: filters.assignee_id,
  });

  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation();

  const [updateTask, { isLoading: updatingTask }] = useUpdateTaskMutation();

  const activeFilterCount = [
    filters.status?.length || 0,
    filters.priority?.length || 0,
    filters.assignee_id?.length || 0,
  ].reduce((sum, count) => sum + count, 0);

  const handleTaskStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    const previousTasks = tasks;

    try {
      await updateTask({
        id: taskId,
        data: { status: newStatus },
      }).unwrap();

      toast.success("Task status updated successfully");
    } catch (error) {
      setTasks(previousTasks);

      // Show error notification
      toast.error("Failed to update task status");
      console.error("Status update failed:", error);
    }
  };

  const handleSubmit = async (task: Task) => {
    try {
      console.log("Submitting task:", task);

      let fileUrl: string | undefined;

      // Only upload if there's a new file (File object)
      if (task.file instanceof File) {
        try {
          fileUrl = await uploadFile(task.file);
        } catch (fileError) {
          console.error("File upload failed:", fileError);
          toast.error("Failed to upload file");
          return; // Stop if file upload fails
        }
      }

      if (currentTask) {
        // For update, keep existing attachment_url if no new file was uploaded
        const updateData = {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee_id: task.assignee_id,
          due_date: task.due_date,
          ...(fileUrl ? { attachment_url: fileUrl } : {}),
        };

        try {
          const response = await updateTask({
            id: currentTask.id,
            data: updateData,
          });

          toast.success("Task updated successfully");
          console.log("Task updated:", response);
        } catch (updateError) {
          console.error("Task update failed:", updateError);
          toast.error("Failed to update task");
        }
      } else {
        const createData = {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee_id: task.assignee_id,
          due_date: task.due_date,
          ...(fileUrl ? { attachment_url: fileUrl } : {}),
        };

        try {
          const response = await createTask(createData);
          toast.success("Task created successfully");
          console.log("Task created:", response);
        } catch (createError) {
          console.error("Task creation failed:", createError);
          toast.error("Failed to create task");
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks =
    data?.data?.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <FilterButton
              onFilter={(newFilters) => {
                setFilters({
                  status: newFilters.status,
                  priority: newFilters.priority,
                  assignee_id: newFilters.assignee_id,
                });
              }}
              activeFilterCount={activeFilterCount}
            />
            <button
              onClick={() => {
                setCurrentTask(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="mr-2" />
              New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <KanbanBoard
          tasks={filteredTasks}
          onTaskStatusChange={handleTaskStatusChange}
          onEditTask={handleEditTask}
        />
      </main>

      <TaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={currentTask}
      />

      <Loader
        loading={isLoading || creatingTask || updatingTask || isLoadingTasks}
      />
    </div>
  );
};

export default Dashboard;
