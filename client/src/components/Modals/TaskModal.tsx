// components/TaskModal.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FiX, FiCalendar, FiPaperclip, FiUser } from "react-icons/fi";
import { users, type Task } from "../../utils/task";
import TextField from "../Inputs/TextFieldProps";
import CustomSelect from "../Inputs/CustomSelect";
import { useGetAllUsersQuery } from "../../api/apiComponents/userApi.js";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Task) => void;
  initialData?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allUsers, isLoading: isUsersLoading } = useGetAllUsersQuery({
    q: searchTerm,
  });
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const due_date = today.toISOString().split("T")[0];
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<Task>({
    defaultValues: initialData || {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee_id: "",
      due_date: due_date,
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null); // Reset error on new file selection

    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    if (initialData) {
      console.log("Initial Data:", initialData);
      const dueDate = initialData.due_date
        ? new Date(initialData.due_date).toISOString().split("T")[0]
        : due_date;

      reset({
        title: initialData.title,
        description: initialData?.description,
        status: initialData?.status,
        priority: initialData?.priority,
        assignee_id: initialData?.assignee_id?._id,
        due_date: dueDate,
      });
    } else {
      reset({
        id: "",
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignee_id: "",
        due_date: due_date,
      });
      setSelectedFile(null);
    }
  }, [initialData, reset, open]);

  useEffect(() => {
    setValue("file", selectedFile);
  }, [selectedFile, setValue]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-lg",
      }}
    >
      <DialogTitle className="flex justify-between items-center bg-gray-50 p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          {initialData ? "Edit Task" : "Create New Task"}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <FiX className="h-5 w-5" />
        </button>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="p-6 space-y-4">
          <TextField
            label="Title"
            name="title"
            placeholder="Enter task title"
            register={register}
            rules={{ required: "Title is required" }}
            error={errors.title?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomSelect
              label="Status"
              name="status"
              options={[
                { value: "todo", label: "To Do" },
                { value: "in_progress", label: "In Progress" },
                { value: "done", label: "Done" },
              ]}
              register={register}
              defaultValue={watch("status")}
            />

            <CustomSelect
              label="Priority"
              name="priority"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              register={register}
              defaultValue={watch("priority")}
            />

            <CustomSelect
              label="Assignee"
              name="assignee_id"
              options={allUsers?.data?.users?.map((user: any) => ({
                value: user._id,
                label: user.name,
              }))}
              register={register}
              withSearch={true}
              onSearch={handleSearch}
              defaultValue={watch("assignee_id")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="date"
                  {...register("due_date", {
                    required: "Due date is required",
                    valueAsDate: true,
                  })}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.due_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <FiPaperclip className="inline mr-1" />
                  {selectedFile ? "Change File" : "Upload File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {selectedFile ? (
                  <div className="ml-2 flex items-center">
                    <span className="text-sm text-gray-700">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ) : initialData?.attachment_url ? (
                  <div className="ml-2">
                    <a
                      href={initialData.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View Attachment
                    </a>
                  </div>
                ) : (
                  <span className="ml-2 text-sm text-gray-500">
                    No file chosen
                  </span>
                )}
              </div>

              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
          </div>
        </DialogContent>

        <DialogActions className="bg-gray-50 px-6 py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {initialData ? "Update Task" : "Create Task"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
