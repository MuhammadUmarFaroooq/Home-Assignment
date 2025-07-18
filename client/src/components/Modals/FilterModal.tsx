// components/modals/FilterModal.tsx
import { Avatar, Dialog } from "@mui/material";
import { FiX } from "react-icons/fi";
import { users, type Task } from "../../utils/task";
import { useState } from "react";
import { useGetAllUsersQuery } from "../../api/apiComponents/userApi";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    status?: Task["status"][];
    priority?: Task["priority"][];
    assignee_id?: string[];
  }) => void;
  onReset: () => void;
  initialFilters: {
    status: Task["status"][];
    priority: Task["priority"][];
    assignee_id: string[];
  };
}

const statusOptions: Task["status"][] = ["todo", "in_progress", "done"];
const priorityOptions: Task["priority"][] = ["low", "medium", "high"];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
}) => {
  const { data: allUsers, isLoading: isUsersLoading } = useGetAllUsersQuery({});
  const [selectedStatus, setSelectedStatus] = useState<Task["status"][]>(
    initialFilters.status
  );
  const [selectedPriority, setSelectedPriority] = useState<Task["priority"][]>(
    initialFilters.priority
  );
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    initialFilters.assignee_id
  );

  const handleApply = () => {
    const filters = {
      ...(selectedStatus.length > 0 && { status: selectedStatus }),
      ...(selectedPriority.length > 0 && { priority: selectedPriority }),
      ...(selectedAssignees.length > 0 && { assignee_id: selectedAssignees }),
    };
    onApply(filters);
  };

  const handleReset = () => {
    setSelectedStatus([]);
    setSelectedPriority([]);
    setSelectedAssignees([]);
    onReset();
  };

  const toggleStatus = (status: Task["status"]) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const togglePriority = (priority: Task["priority"]) => {
    setSelectedPriority((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-lg",
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Filter Tasks</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <FilterSection
            title="Status"
            options={statusOptions}
            selected={selectedStatus}
            onToggle={toggleStatus}
            formatOption={(opt) => opt.replace("_", " ")}
            getOptionClass={(opt) =>
              selectedStatus.includes(opt)
                ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }
          />
          <FilterSection
            title="Priority"
            options={priorityOptions}
            selected={selectedPriority}
            onToggle={togglePriority}
            getOptionClass={(opt) =>
              selectedPriority.includes(opt)
                ? {
                    low: "bg-green-100 text-green-800 border border-green-300",
                    medium:
                      "bg-yellow-100 text-yellow-800 border border-yellow-300",
                    high: "bg-red-100 text-red-800 border border-red-300",
                  }[opt]
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }
          />
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Assignee</h4>
            <div className="space-y-2">
              {allUsers?.data?.users?.map((user) => (
                <div key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`assignee-${user._id}`}
                    checked={selectedAssignees.includes(user._id)}
                    onChange={() => toggleAssignee(user._id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`assignee-${user._id}`}
                    className="ml-2 flex items-center"
                  >
                    <Avatar
                      sx={{
                        bgcolor: "skyblue",
                        width: 32,
                        height: 32,
                        fontSize: 14,
                      }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                    <span className="ml-2">{user.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              handleApply();
              onClose();
            }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Dialog>
  );
};

interface FilterSectionProps<T extends string> {
  title: string;
  options: T[];
  selected: T[];
  onToggle: (option: T) => void;
  formatOption?: (option: T) => string;
  getOptionClass?: (option: T) => string;
}

const FilterSection = <T extends string>({
  title,
  options,
  selected,
  onToggle,
  formatOption = (opt) => opt,
  getOptionClass = () => "bg-gray-100 text-gray-800",
}: FilterSectionProps<T>) => (
  <div>
    <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          className={`px-3 py-1 rounded-full text-sm ${
            selected.includes(option)
              ? getOptionClass(option)
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {formatOption(option)}
        </button>
      ))}
    </div>
  </div>
);
