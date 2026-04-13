import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async () => {
    const res = await fetch("/api/tasks")
    return res.json()
  }
)

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
  },
  reducers : {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload
      state.loading = false
    })
  },
})

export default tasksSlice.reducer