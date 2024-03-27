/* eslint-disable @next/next/no-img-element */
import { ReactNode, useEffect } from "react";
import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { useFlags } from "launchdarkly-react-client-sdk";
import Prism from "prismjs";
// @ts-expect-error no proper types for prism
import PrismJsx from "prismjs/components/prism-jsx";

const name = "Feature flags with LaunchDarkly";
export const siteTitle = "feature flags";

interface Props {
  children: ReactNode;
  home?: boolean;
}

const Layout = ({ children, home }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const { newBlogDesign } = useFlags();

  if (typeof window !== "undefined") {
    const bodyEl = window.document.getElementsByTagName("body");
    newBlogDesign
      ? bodyEl[0].classList.add("redesign")
      : bodyEl[0].classList.remove("redesign");
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <img
                src="/images/profile.jpg"
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt={name}
              />
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
};
export default Layout;
