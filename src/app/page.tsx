'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Page from '~/components/page';
import Title from '~/components/title';
import { CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

interface User {
  name: string;
  email: string;
}

export default function Home() {
  const GoogleClientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  //console.log('CLIENTID', GoogleClientID)

  const [welcome, setWelcome] = useState('');

  const responseMessage = async (response: CredentialResponse) => {
    console.log('Login', response);
    if (typeof response.credential === 'undefined') {
      return;
    }
    const user = jwtDecode<User>(response.credential);
    console.log('USER', user);
    console.log('Welcome', user.name, user.email);
    setWelcome('Welcome ' + user.name);
    // TODO: save token in DB for authorization
  };

  const errorMessage = (error: string) => {
    console.log('Error', error);
  };

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
            // onError={errorMessage}
            logo_alignment="left"
            shape="rectangular"
            size="large"
            theme="filled_blue"
            text="signin_with"
            type="standard"
            ux_mode="popup"
            itp_support
            useOneTap
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
  );
}
