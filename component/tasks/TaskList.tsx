"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, fetchTasks } from "@/redux/taskSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus } from "@/redux/taskSlice";
import { Button } from "@/components/ui/button";
import { CreateTask } from "./CreateTask";
import FilterTask from "./FilterTask";
import { subscribeToTasks } from "@/utils/subscribeToTasks";

export function TaskList() {
  const dispatch = useDispatch<any>();
  const { tasks } = useSelector((state: any) => state.tasks);
  const user = useSelector((state: any) => state.auth);
  const [editTaskData, setEditTaskData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
const tasksPerPage = 9;


  const [usersMap, setUsersMap] = useState<any>({});

  useEffect(() => {
    // dispatch(fetchTasks());
    const unsubscribe = subscribeToTasks(dispatch);

    return ()=> unsubscribe()
  }, [dispatch]);



  useEffect(() => {
    const fetchUsers = async () => {
      const map: any = {};

      for (const task of tasks) {
        if (task.ownerId && !map[task.ownerId]) {
          const snap = await getDoc(doc(db, "users", task.ownerId));
          if (snap.exists()) {
            map[task.ownerId] = snap.data().name;
          }
        }

        if (task.assignedTo && !map[task.assignedTo]) {
          const snap = await getDoc(doc(db, "users", task.assignedTo));
          if (snap.exists()) {
            map[task.assignedTo] = snap.data().name;
          }
        }
      }

      setUsersMap(map);
    };

    if (tasks.length) fetchUsers();
  }, [tasks]);

  const filteredTasks = tasks.filter((task: any) => {
    if (user.role !== "admin") {
      const isVisible =
        task.ownerId === user.uid || task.assignedTo === user.uid;

      if (!isVisible) return false;
    }

    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }

    if (ownerFilter !== "all" && task.ownerId !== ownerFilter) {
      return false;
    }

    if (assignedFilter !== "all" && task.assignedTo !== assignedFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

const startIndex = (currentPage - 1) * tasksPerPage;
const paginatedTasks = filteredTasks.slice(
  startIndex,
  startIndex + tasksPerPage
);

  return (
    <>
      <FilterTask
        setStatusFilter={setStatusFilter}
        setOwnerFilter={setOwnerFilter}
        setAssignedFilter={setAssignedFilter}
        user={user}
        usersMap={usersMap}
      />

      <div className="grid md:grid-cols-3 gap-4 mt-6 px-6 font-mono">
        {paginatedTasks.map((task: any) => (
          <Card
            key={task.id}
            className="bg-zinc-900 border border-zinc-800 text-white"
          >
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-bold">{task.title}</h2>

              <p className="text-sm text-zinc-400">{task.description}</p>

              <Select
                defaultValue={task.status}
                onValueChange={(value) =>
                  dispatch(updateTaskStatus({ id: task.id, status: value }))
                }
              >
                <SelectTrigger className="bg-zinc-700 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-zinc-900 text-white">
                  <SelectItem value="todo">📝 Todo</SelectItem>
                  <SelectItem value="in-progress">⚡ In Progress</SelectItem>
                  <SelectItem value="done">✅ Done</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-zinc-500">Due: {task.dueDate}</p>

              <p className="text-xs text-zinc-500">
                Owner:{" "}
                {task.ownerId === user.uid
                  ? "You"
                  : usersMap[task.ownerId] || "Loading..."}
              </p>

              <p className="text-xs text-zinc-500">
                Assigned to:{" "}
                {task.assignedTo
                  ? task.assignedTo === user.uid
                    ? "You"
                    : usersMap[task.assignedTo] || "Loading..."
                  : "Unassigned"}
              </p>

              <div className="flex items-center  gap-3">
                {(user.uid !== task.ownerId && user.role !== "admin")  ? (
                  <Badge variant="outline" className="text-xs text-white P-2">
                    Not Owner
                  </Badge>
                ) : (
                  <Button
                    onClick={() => dispatch(deleteTask(task.id))}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer"
                  >
                    Delete
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setEditTask(task);
                    setOpen(true);
                  }}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700"
                >
                  Edit
                </Button>
                {editTask && (
                  <CreateTask
                    open={open}
                    setOpen={setOpen}
                    editTask={editTask}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap fixed bottom-0 left-1/2 transform -translate-x-1/2 p-2">

  
  <Button
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
    className="bg-zinc-800 hover:bg-zinc-700 text-white"
  >
    Prev
  </Button>

  
  {[...Array(totalPages)].map((_, index) => {
    const page = index + 1;

    return (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded-md text-sm transition-all ${
          currentPage === page
            ? "bg-blue-600 text-white shadow-lg scale-105"
            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
        }`}
      >
        {page}
      </button>
    );
  })}


  <Button
    onClick={() =>
      setCurrentPage((p) => Math.min(p + 1, totalPages))
    }
    disabled={currentPage === totalPages}
    className="bg-zinc-800 hover:bg-zinc-700 text-white"
  >
    Next 
  </Button>
</div>
    </>
  );
}
