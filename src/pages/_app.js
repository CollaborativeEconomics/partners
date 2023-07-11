import Session from "~/components/session"
import '~/app/globals.css'
import styles from "~/components/dashboard.module.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <Session>
      <Component {...pageProps} />
    </Session>
  );
}
