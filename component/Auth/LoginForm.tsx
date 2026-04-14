"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { doc, getDoc } from "firebase/firestore"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/authSlice"
import Link from "next/link"



export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()

  const handleLogin = async () => {
    try {

         setLoading(true)
      const userCred  =  await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db,"users",userCred.user.uid));

      if (!snap.exists()) {
        throw new Error("User data not found in Firestore")
      }

      const userData = snap.data()

      dispatch(setUser({
          uid: userCred.user.uid,
          email: userCred.user.email,
          role: userData.role,
        }))

      toast.success("Logged in!");
      router.push("/");

    } catch (err: any) {
  toast.error(err.message)
     }

    finally{
        setLoading(false)
    }
  }

  return (
    <>
    <Card className="w-[350px] bg-zinc-900 border border-zinc-800 shadow-2xl">
      <CardContent className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>

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

        <Button onClick={handleLogin} className="w-full bg-purple-600 text-xl cursor-pointer">
        {loading ? "Loading..." : "Login"}
        </Button>
       <h3 className="text-stone-400 text-md">Don't have Account : <Link href="/register" className="text-blue-400">register</Link> </h3>
      </CardContent>
    </Card>
        
         </>
  )
}