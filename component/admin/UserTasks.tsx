"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"

export function UserTasks({ user }: any) {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"))

      const list: any[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()

        if (
          data.ownerId === user.uid ||
          data.assignedTo === user.uid
        ) {
          list.push({
            id: doc.id,
            ...data,
          })
        }
      })

      setTasks(list)
    }

    if (user) fetchTasks()
  }, [user])

const totalTasks = tasks.length

const todoCount = tasks.filter((t) => t.status === "todo").length
const inProgressCount = tasks.filter((t) => t.status === "in-progress").length
const doneCount = tasks.filter((t) => t.status === "done").length

const overdueCount = tasks.filter(
  (t) => new Date(t.dueDate) < new Date() && t.status !== "done"
).length

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">
        Tasks of {user.name || user.email}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
  <Card className="bg-zinc-900 text-white">
    <CardContent className="p-4 text-center">
      <p className="text-sm text-zinc-400">Total</p>
      <h2 className="text-2xl font-bold">{totalTasks}</h2>
    </CardContent>
  </Card>

  <Card className="bg-zinc-900 text-white">
    <CardContent className="p-4 text-center">
      <p className="text-sm text-zinc-400">Todo</p>
      <h2 className="text-2xl font-bold">{todoCount}</h2>
    </CardContent>
  </Card>

  <Card className="bg-zinc-900 text-white">
    <CardContent className="p-4 text-center">
      <p className="text-sm text-zinc-400">In Progress</p>
      <h2 className="text-2xl font-bold">{inProgressCount}</h2>
    </CardContent>
  </Card>

  <Card className="bg-zinc-900 text-white">
    <CardContent className="p-4 text-center">
      <p className="text-sm text-zinc-400">Done</p>
      <h2 className="text-2xl font-bold text-green-400">
        {doneCount}
      </h2>
    </CardContent>
  </Card>

  <Card className="bg-zinc-900 text-white border border-red-500">
    <CardContent className="p-4 text-center">
      <p className="text-sm text-red-400">Overdue</p>
      <h2 className="text-2xl font-bold text-red-400">
        {overdueCount}
      </h2>
    </CardContent>
  </Card>
</div>

      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-zinc-900 text-white">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm text-zinc-400">
                {task.description}
              </p>
              <p className="text-xs">Status: {task.status}</p>
              <p className="text-xs">Due: {task.dueDate}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}