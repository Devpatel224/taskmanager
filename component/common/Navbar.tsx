"use client"

import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/redux/authSlice"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector((state: any) => state.auth);


  console.log("user in navba", user?.role)

  const handleLogout = async () => {
    await signOut(auth)
    dispatch(logout())
    router.push("/login")
  }

  return (
    <div className="w-full h-16 border-b border-zinc-800 bg-black flex items-center justify-between px-6 font-mono">
    
      <h1 className="text-xl font-bold text-white tracking-wide">
        TaskManager
      </h1>

      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-0">
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-purple-600 text-white">
                  {user?.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-zinc-900 border-zinc-800 font-bold text-lg ">
             <DropdownMenuItem
                 onClick={()=>router.push("/")}
              className="cursor-pointer hover:bg-zinc-800 text-white font-bold"
            >
              Home
            </DropdownMenuItem>
            {
              user?.role === "admin" && (
                <DropdownMenuItem
                 onClick={()=>router.push("/dashboard")}
              className="cursor-pointer hover:bg-zinc-800 text-white font-bold"
            >
              All Users
            </DropdownMenuItem>
              )
            }
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer hover:bg-zinc-800 text-red-600 font-bold"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}