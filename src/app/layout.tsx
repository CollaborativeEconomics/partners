import { Inter } from 'next/font/google'
import Session from "~/components/session"
import '~/app/globals.css'

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
          {children}
        </Session>
      </body>
    </html>
  )
}
