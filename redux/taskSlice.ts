import { db } from "@/lib/firebase"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore"

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async () => {
    const snapshot = await getDocs(collection(db, "tasks"))

    const tasks: any[] = []

    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return tasks
  }
)
export const createTask = createAsyncThunk(
  "tasks/create",
  async (task: any) => {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      createdAt: Timestamp.now(),
    })

    return { id: docRef.id, ...task }
  }
)

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status }: { id: string; status: string }) => {
    await updateDoc(doc(db, "tasks", id), {
      status,
    })

    return { id, status }
  }
)

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string) => {
    await deleteDoc(doc(db, "tasks", id))
    return id
  }
)

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: any }) => {
    await updateDoc(doc(db, "tasks", id), data)
    return { id, data }
  }
)

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
  },
  reducers : {
    setTasks : (state,action)=>{
      state.tasks = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload
      state.loading = false
    })

    builder.addCase(createTask.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload)
      state.loading = false
    })

    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
  const task = state.tasks.find((t: any) => t.id === action.payload.id)
  if (task) {
    task.status = action.payload.status
  }
})

builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((t: any) => t.id !== action.payload)
    })

builder.addCase(updateTask.fulfilled, (state, action) => {
      const task = state.tasks.find((t: any) => t.id === action.payload.id)
      if (task) {
        Object.assign(task, action.payload.data)
      }
    })


  },
})

export const {setTasks} = tasksSlice.actions
export default tasksSlice.reducer