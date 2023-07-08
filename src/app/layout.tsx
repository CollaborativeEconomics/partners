import './globals.css'
import { Inter } from 'next/font/google'
import Session from "~/components/session"
import Header from "~/components/header"
import Footer from "~/components/footer"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Give Partners',
  description: 'Partners Portal for Give App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Session>
          <Header />
            {children}
          <Footer />
        </Session>
      </body>
    </html>
  )
}
