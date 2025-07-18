// components/buttons/FilterButton.tsx
import { FiFilter } from "react-icons/fi";
import { useState } from "react";
import type { Task } from "../../utils/task";
import { FilterModal } from "../Modals/FilterModal";

interface FilterButtonProps {
  onFilter: (filters: {
    status?: Task["status"][];
    priority?: Task["priority"][];
    assignee_id?: string[];
  }) => void;
  activeFilterCount: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onFilter,
  activeFilterCount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<{
    status: Task["status"][];
    priority: Task["priority"][];
    assignee_id: string[];
  }>({
    status: [],
    priority: [],
    assignee_id: [],
  });

  const handleApply = (filters: {
    status?: Task["status"][];
    priority?: Task["priority"][];
    assignee_id?: string[];
  }) => {
    const newFilters = {
      status: filters.status || [],
      priority: filters.priority || [],
      assignee_id: filters.assignee_id || [],
    };

    setCurrentFilters(newFilters);
    onFilter(newFilters);
    console.log("Applied filters:", newFilters); // Log the applied filters
  };

  const handleReset = () => {
    const resetFilters = {
      status: [],
      priority: [],
      assignee_id: [],
    };
    setCurrentFilters(resetFilters);
    onFilter({});
    console.log("Filters reset"); // Log reset action
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
      >
        <FiFilter className="mr-2" />
        Filter
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        onReset={handleReset}
        initialFilters={currentFilters}
      />
    </>
  );
};
