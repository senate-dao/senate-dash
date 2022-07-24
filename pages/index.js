import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Forms from "./forms";
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Seneate DAO</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Seneate DAO</h1>

        <p className={styles.description}>Your window to delegation</p>

        <div className={styles.grid}>
          <Link passHref href="/forms" className={styles.card}>
            <a>Forums</a>
          </Link>

          <Link passHref href="/votes" className={styles.card}>
            <h2>Votes &rarr;</h2>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
