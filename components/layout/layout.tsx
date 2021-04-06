import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "../header";

import styles from "./layout.module.css";
import Footer from "../footer";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className={styles.container}>
    <Head>
      <title>Idle RPG</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <main className={styles.main}>{props.children}</main>
    <Footer />
  </div>
);

export default Layout;
