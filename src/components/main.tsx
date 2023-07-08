import { PropsWithChildren } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface PageProps {
  className?: string
}

const Page = ({
  className,
  children
}: PropsWithChildren<PageProps>) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <main className={`container h-full flex flex-col items-center justify-start m-8 p-24 max-w-3xl rounded-2xl px-6 py-6 bg-slate-800 ${className}`}>
        <Link href="/">
          <Image src="/give-logo.svg" alt="Give Logo" className="h-20 w-auto mx-auto my-6" width={250} height={80} />
        </Link>
        {children}
      </main>
    </div>
  )
}

export default Page
