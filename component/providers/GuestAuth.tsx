"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"

export function GuestGuard({ children }: any) {
  const { uid, isAuthReady } = useSelector((state: any) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isAuthReady && uid) {
      router.push("/") 
    }
  }, [uid, isAuthReady, router])

  if (!isAuthReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Checking auth...
      </div>
    )
  }

  return children
}