'use client'

import { CreateTask } from "@/component/tasks/CreateTask";
import { TaskList } from "@/component/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function Home() {
   const [open, setOpen] = useState(false)
  return (
    <div className="bg-gray-950 text-white w-full h-screen">
      <div className="w-full p-4 flex items-center justify-between ">
        <h1 className="text-purple-400 text-3xl  text-center ">Task Manager</h1>


         <Button
        onClick={() => setOpen(true)}
        className="text-xl bg-green-700 hover:bg-green-900"
      >
        + Create Task
      </Button>
      
        {
          open && (<CreateTask open={open} setOpen={setOpen} />)
        }


      </div>
        <TaskList/>
    </div>
  );
}
