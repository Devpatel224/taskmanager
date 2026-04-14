import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description is required").regex(/[a-zA-Z0-9]/, "Description must contain letters or numbers"),
  dueDate: z.string().refine((date) => {
  const selected = new Date(date)
  const today = new Date()


  selected.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  return selected >= today
}, "Due date cannot be in the past"),
  assignedTo: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>
