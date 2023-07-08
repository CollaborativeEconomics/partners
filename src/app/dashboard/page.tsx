"use client"
//import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import AccessDenied from "~/components/accessdenied"
import Main from '~/components/main'
import Title from '~/components/title'

export default function Page() {
  const { data: session } = useSession()
  if (!session) {
    return (<AccessDenied />)
  }

  return (
    <Main>
      <Title text="Partner Portal" />
      <div>
        <h1>DASHBOARD</h1>
        <p>Under construction...</p>
      </div>
    </Main>
  )
}
