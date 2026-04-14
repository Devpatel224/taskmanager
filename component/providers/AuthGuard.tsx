"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { getIdToken } from "firebase/auth"

export function AuthGuard({ children }: any) {
  const { uid, isAuthReady } = useSelector((state: any) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isAuthReady && !uid) {
      router.push("/login")
    }
  }, [uid, isAuthReady, router])

  if (!isAuthReady) {
    return (
      <div className="h-screen flex  text-white bg-black">
        Checking auth...
      </div>
    )
  }

  return children
}