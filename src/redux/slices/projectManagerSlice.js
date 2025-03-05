import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectManagerService from "../../services/projectManagerServices";

// Fetch all project_manager
export const fetchProjectManager = createAsyncThunk("project_manager/fetchProjectManager", async (queryParams, thunkAPI) => {
    try {
        const response = await projectManagerService.getAllProjectManager(queryParams);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Add new project_manager
export const addProjectManager = createAsyncThunk("project_manager/addProjectManager", async (projectManagerData, thunkAPI) => {
    try {
        const response = await projectManagerService.addProjectManager(projectManagerData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Update project_manager
export const updateProjectManager = createAsyncThunk("project_manager/updateProjectManager", async ({ id, projectManagerData }, thunkAPI) => {
    try {
        const response = await projectManagerService.updateProjectManager(id, projectManagerData);
        return response.data;
    } catch (error) {
        console.error("Update project_manager error:", error); // Log error details for debugging
        return thunkAPI.rejectWithValue(error.response.data);
    }
});


// Delete project_manager
export const deleteProjectManager = createAsyncThunk("project_manager/deleteProjectManager", async (id, thunkAPI) => {
    try {
        await projectManagerService.deleteProjectManager(id);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const projectManagerSlice = createSlice({
    name: "project_manager",
    initialState: {
        project_managerList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectManager.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectManager.fulfilled, (state, action) => {
                state.loading = false;
                state.project_managerList = action.payload.project_managerList;
            })
            .addCase(fetchProjectManager.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProjectManager.fulfilled, (state, action) => {
                state.project_managerList.push(action.payload);
            })
            .addCase(updateProjectManager.fulfilled, (state, action) => {
                console.log("Updated project_manager:", action.payload); // Add this log
                const index = state.project_managerList.findIndex(project_manager => project_manager._id === action.payload._id);
                if (index !== -1) {
                    state.project_managerList[index] = action.payload;
                }
            })
            .addCase(deleteProjectManager.fulfilled, (state, action) => {
                state.project_managerList = state.project_managerList.filter(project_manager => project_manager._id !== action.payload);
            });
    }
});

export default projectManagerSlice.reducer;
