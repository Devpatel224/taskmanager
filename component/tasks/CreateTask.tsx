"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "@/redux/taskSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { TaskFormData, taskSchema } from "@/zod/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  editTask?: any;
};

export function CreateTask({ open, setOpen, editTask }: Props) {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: any) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

    const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  })


  useEffect(() => {
    if (editTask) {
      setValue("title", editTask.title)
      setValue("description", editTask.description)
      setValue("dueDate", editTask.dueDate)
      setValue("assignedTo", editTask.assignedTo || "")
    }
  }, [editTask, setValue])

 
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"))
      const list: any[] = []

      snapshot.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() })
      })

      setUsers(list.filter((u) => u.role !== "admin"))
    }

    fetchUsers()
  }, [])


  const onSubmit = async (data: TaskFormData) => {
    try {
      setLoading(true)

      if (editTask) {
        await dispatch(
          updateTask({
            id: editTask.id,
            data: {
              ...data,
              assignedTo: data.assignedTo || null,
            },
          })
        )
        toast.success("Task updated!")
      } else {
        await dispatch(
          createTask({
            ...data,
            status: "todo",
            ownerId: user.uid,
            assignedTo: data.assignedTo || null,
          })
        )
        toast.success("Task created!")
      }

      reset()
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    open && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <Card className="w-[400px] bg-zinc-900 border border-zinc-800 text-white">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-center">
              {editTask ? "Edit Task" : "Create Task"}
            </h2>

            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              
              <div>
                <Input
                  placeholder="Title"
                  {...register("title")}
                  className="bg-zinc-800"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Textarea
                  placeholder="Description"
                  {...register("description")}
                  className="bg-zinc-800"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="date"
                  {...register("dueDate")}
                  className="bg-zinc-800"
                />
                {errors.dueDate && (
                  <p className="text-red-400 text-xs">{errors.dueDate.message}</p>
                )}
              </div>

              <Select onValueChange={(val) => setValue("assignedTo", val)}>
                <SelectTrigger className="bg-zinc-800">
                  <SelectValue placeholder="Assign user" />
                </SelectTrigger>

                <SelectContent className="bg-zinc-900 text-white">
                  {users.map((u) => (
                    <SelectItem key={u.uid} value={u.uid}>
                      {u.uid === user.uid
                        ? "You"
                        : `${u.name} (${u.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="w-1/2 bg-purple-600 hover:bg-purple-700">
                  {loading
                    ? editTask
                      ? "Updating..."
                      : "Creating..."
                    : editTask
                      ? "Update"
                      : "Create"
                      }
                </Button>

                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-1/2 bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  )
}