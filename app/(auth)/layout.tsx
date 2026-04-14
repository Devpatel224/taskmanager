import { GuestGuard } from '@/component/providers/GuestAuth'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
    
  return (
    <div>
     <GuestGuard>
      {children}
      </GuestGuard>
    </div>
  )
}

export default layout
