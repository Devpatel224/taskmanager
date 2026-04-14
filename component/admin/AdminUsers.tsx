"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"

export function AdminUsers({ onSelectUser }: any) {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"))

      const list: any[] = []
      snapshot.forEach((doc) => {
        list.push({
          uid: doc.id,
          ...doc.data(),
        })
      })

      setUsers(list)
    }

    fetchUsers()
  }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4">
      {users.map((u) => (
        <Card
          key={u.uid}
          onClick={() => onSelectUser(u)}
          className="cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-purple-500"
        >
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-white">
              {u.name || "No Name"}
            </h2>
            <p className="text-sm text-zinc-400">{u.email}</p>
            <p className="text-xs text-purple-400">{u.role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}