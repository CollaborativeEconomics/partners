"use client"
import { useEffect, useState } from 'react'
import Link from 'next/Link'
import Page from '~/components/page'
import Title from '~/components/title'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'

export default function Home() {
  const GoogleClientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  //console.log('CLIENTID', GoogleClientID)

  const [welcome, setWelcome] = useState('')

  const responseMessage = async (response) => {
    console.log('Login', response)
    const user = jwtDecode(response.credential);
    console.log('USER', user)
    console.log('Welcome', user.name, user.email)
    setWelcome('Welcome '+user.name)
    // TODO: save token in DB for authorization
  }

  const errorMessage = (error) => {
    console.log('Error', error)
  }

  return (
    <GoogleOAuthProvider clientId={GoogleClientID}>
      <Page>
        <Title text="Partner Portal" />
        <div className="py-4">
          <li>Monitor your crypto donations</li>
          <li>Create funding initiatives</li>
          <li>Update donors by creating impact NFTs</li>
          <li>Add or change crypto-wallets</li>
        </div>
        <h1 className="py-12">Log in with your google account</h1>
        <div className="pb-4">
          <GoogleLogin 
            onSuccess={responseMessage} 
            onError={errorMessage} 
            itp_support="true"
            logo_alignment="left" 
            shape="rectangular"
            size="large"
            theme="filled_blue"
            text="signin_with"
            type="standard"
            useOneTap="true"
            ux_mode="popup"
          />
        </div>
        <h3 className="pb-12">{welcome}</h3>
      <div className="text-slate-500">
        <Link href="terms">Terms and Conditions</Link>
        <span className="px-4">•</span>
        <Link href="privacy">Privacy Policy</Link>
      </div>
      </Page>
    </GoogleOAuthProvider>
  )
}
