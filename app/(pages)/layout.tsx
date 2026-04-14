import { Navbar } from '@/component/common/Navbar';
import { AuthGuard } from '@/component/providers/AuthGuard';
import { AuthListener } from '@/component/providers/AuthListener';
import { auth } from '@/lib/firebase';
import { getIdToken } from 'firebase/auth';
import { redirect } from 'next/navigation';
import React, { Children } from 'react'

async function layout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div>
      <AuthListener/>
      <AuthGuard>
      <Navbar/>
      {children}
      </AuthGuard>
    </div>
  )
}

export default layout
