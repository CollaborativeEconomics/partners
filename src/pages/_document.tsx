import Document, { Html, Head, Main, NextScript } from 'next/document';
import Session from "~/components/session"
import Dashboard from "~/components/dashboard"
import Sidebar from "~/components/sidebar"
import Content from "~/components/content"
import styles from "~/components/dashboard.module.css"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        </Head>
        <body>
          <Session>
            <Dashboard>
              <Sidebar />
              <Content>
                <Main />
                <NextScript />
              </Content>
            </Dashboard>
          </Session>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
