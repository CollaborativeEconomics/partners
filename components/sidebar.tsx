import { PropsWithChildren } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import styles from 'styles/dashboard.module.css'

interface PageProps {
  className?: string
}

const Sidebar = ({
  className,
  children
}: PropsWithChildren<PageProps>) => {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  console.log('SESSION', session)

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoBox}>
        <Link href="/dashboard" className={styles.logoLink}>
          <Image src="/give-logo.svg" alt="Give Logo" className={styles.logoImage} width={200} height={60} />
        </Link>
      </div>
      <nav className={styles.menu}>
        <li className={styles.menuItem}><Link href="/dashboard/donations">Donations</Link></li>
        <li className={styles.menuItem}><Link href="/dashboard/initiatives">Initiatives</Link></li>
        <li className={styles.menuItem}><Link href="/dashboard/impact">Impact NFTs</Link></li>
        <li className={styles.menuItem}><Link href="/dashboard/wallets">Wallets</Link></li>
      </nav>
      <div className={styles.loginBox}>
        <div className={styles.signedInStatus}>
          <p className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}>
            {!session && (
              <>
                <span className={styles.notSignedInText}>
                  You are not signed in
                </span>
                <a
                  href={`/api/auth/signin`}
                  className={styles.buttonPrimary}
                  onClick={(e) => {
                    e.preventDefault()
                    signIn()
                  }}>Sign in</a>
              </>
            )}
            {session?.user && (
              <>
                {session.user.image && (
                  <span
                    style={{ backgroundImage: `url('${session.user.image}')` }}
                    className={styles.avatar}
                  />
                )}
                <span className={styles.signedInText}>
                  <small>Signed in as</small>
                  <br />
                  <strong>{session.user.email ?? session.user.name}</strong>
                </span>
                <a
                  href={`/api/auth/signout`}
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault()
                    signOut()
                  }}>Sign out</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
