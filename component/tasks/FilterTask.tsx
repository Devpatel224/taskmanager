'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type props = {
    setStatusFilter: (val: string) => void
    setOwnerFilter : (val: string) => void
    setAssignedFilter : (val: string) => void
    user : any,
    usersMap : any
}

function FilterTask({setStatusFilter , setOwnerFilter ,  setAssignedFilter , user , usersMap}:props) {
  return (
    <div className='w-full'>
      <div className="flex flex-wrap gap-4 px-6 mt-4">
  {/* Status Filter */}
  <Select onValueChange={setStatusFilter} defaultValue="all">
    <SelectTrigger className="w-[180px] bg-zinc-800">
      <SelectValue placeholder="Filter by Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="todo">Todo</SelectItem>
      <SelectItem value="in-progress">In Progress</SelectItem>
      <SelectItem value="done">Done</SelectItem>
    </SelectContent>
  </Select>

  {/* Owner Filter */}
  <Select onValueChange={setOwnerFilter} defaultValue="all">
    <SelectTrigger className="w-[180px] bg-zinc-800">
      <SelectValue placeholder="Filter by Owner" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Owners</SelectItem>
      <SelectItem value={user.uid}>You</SelectItem>
    </SelectContent>
  </Select>

  {/* Assigned Filter */}
  <Select onValueChange={setAssignedFilter} defaultValue="all">
    <SelectTrigger className="w-[200px] bg-zinc-800">
      <SelectValue placeholder="Assigned To" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Assigned</SelectItem>
      <SelectItem value={user.uid}>You</SelectItem>

      {Object.entries(usersMap).map(([uid, name]: any) => (
        <SelectItem key={uid} value={uid}>
          {name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
    </div>
  )
}

export default FilterTask
