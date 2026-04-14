
"use client"

import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { useDispatch } from "react-redux"
import { setUser, logout, setAuthReady } from "@/redux/authSlice"
import { doc, getDoc } from "firebase/firestore"

export function AuthListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
      
        const snap = await getDoc(doc(db, "users", user.uid))

        if (snap.exists()) {
          const data = snap.data()

          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              role: data.role,
              isAuthReady: true
            })
          )
        }
      } else {
        dispatch(logout())
      }
      dispatch(setAuthReady(true))
    })

    return () => unsubscribe()
  }, [dispatch])

  return null
}