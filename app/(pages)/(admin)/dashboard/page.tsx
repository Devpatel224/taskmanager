"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { AdminUsers } from "@/component/admin/AdminUsers"
import { UserTasks } from "@/component/admin/UserTasks"

export default function Page() {
  const [selectedUser, setSelectedUser] = useState<any>(null)

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white font-mono">
      <h1 className="text-3xl text-center p-4 text-purple-400">
        Admin Dashboard
      </h1>

      {!selectedUser ? (
        <AdminUsers onSelectUser={setSelectedUser} />
      ) : (
        <>
          <Button
            onClick={() => setSelectedUser(null)}
            className="m-4 bg-gray-700"
          >
            ← Back
          </Button>

          <UserTasks user={selectedUser} />
        </>
      )}
    </div>
  )
}