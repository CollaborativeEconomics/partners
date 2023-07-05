import { PropsWithChildren } from 'react'
import Link from 'next/Link'

interface PageProps {
  className?: string
}

const Page = ({
  className,
  children
}: PropsWithChildren<PageProps>) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className={`container h-full flex flex-col items-center justify-start p-24 max-w-3xl rounded-2xl px-6 py-6 bg-slate-800 ${className}`}>
        <Link href="/"><img src="/give-logo.svg" alt="Give" className="h-20 w-auto mx-auto my-6" /></Link>
        {children}
      </main>
    </div>
  )
}

export default Page
