"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"



export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleRegister = async () => {
    try {
        setLoading(true)
      const userCred = await createUserWithEmailAndPassword(auth, email, password)


     const res =   await setDoc(doc(db, "users", userCred.user.uid), {
        name: name,
        email: userCred.user.email,
        role: "user", 
        createdAt: new Date(),
      })
      

    
      toast.success("Register Successfully")
      router.replace("/login")
    } catch (err: any) {
      alert(err.message)
    }

    finally{
        setLoading(false)
    }
  }

  return (
    <Card className="w-[350px] bg-zinc-900 border border-zinc-800 shadow-2xl">
      <CardContent className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-white">Register</h1>

        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white"
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white"
        />

        <Button onClick={handleRegister} disabled={loading} className="w-full bg-purple-500 text-xl cursor-pointer">
          {loading ? "Loading..." : "Register"}
        </Button>
      </CardContent>
    </Card>
  )
}