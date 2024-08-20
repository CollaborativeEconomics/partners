import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import { ThirdwebProvider } from "thirdweb/react"

const inter = Inter({ subsets: ['latin'] })

export default function App({Component, pageProps}) {
  return (
    <SessionProvider>
      <ThirdwebProvider>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
      </ThirdwebProvider>
    </SessionProvider>
  )
}
