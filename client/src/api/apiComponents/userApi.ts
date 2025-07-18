import { prepareQueryParams } from "../../utils/prepareQueryParams";
import { apiSlice } from "../apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => {
        const queryParams = prepareQueryParams(params);
        return {
          url: "users",
          ...(queryParams && { params: queryParams }),
        };
      },
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
