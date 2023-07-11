"use client"
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import Link from 'next/link'
import Header from "~/components/header"
import Footer from "~/components/footer"
import Main from '~/components/main'
import Title from '~/components/title'
import LinkButton from '~/components/linkbutton'

export default function Page() {
  const session = useSession()
  console.log('SESSION?', session)
  const loginText = 'Log in with your Google account'
  const [welcome, setWelcome] = useState(loginText)
  const [logged, setLogged] = useState(false)

  function titleCase(str='') {
    const words = str.toLowerCase().split(' ')
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
    }
    return words.join(' ')
  }

  useEffect(()=>{
    const name = session?.data?.user?.name ?? ''
    const welcomeText = 'Welcome '+titleCase(name)
    setWelcome(name ? welcomeText : loginText)
    setLogged(name ? true : false)
  },[session])
  
  return (
    <>
      <Header />
      <Main>
        <Title text="Partner Portal" />
        <div className="py-4">
          <li>Monitor your crypto donations</li>
          <li>Create funding initiatives</li>
          <li>Update donors by creating impact NFTs</li>
          <li>Add or change crypto-wallets</li>
        </div>
        <h3 className="pt-12 pb-4">{welcome}</h3>
        {logged && (<LinkButton className="mb-12" text="GO TO DASHBOARD" href="/dashboard/donations" />)}
      </Main>
      <Footer />
    </>
  )
}
