import { prepareQueryParams } from "../../utils/prepareQueryParams";
import { apiSlice } from "../apiSlice";

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  
    createTask: builder.mutation({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({id, data}) => ({
        url: `tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    getAllTasks: builder.query({
      query: (params) => {
        const queryParams = prepareQueryParams(params);
        return {
          url: "tasks",
          ...(queryParams && { params: queryParams }),
        };
      },
      providesTags: ["Tasks"],
    }),
  }),
});

export const { useCreateTaskMutation,useUpdateTaskMutation,useDeleteTaskMutation,useGetAllTasksQuery } = taskApi;
