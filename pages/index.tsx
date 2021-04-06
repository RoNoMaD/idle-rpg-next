import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/client";
import Link from "next/link";

import { findCharactersByUserEmail } from "@dao/characters";
import Layout from "@components/layout/layout";

import styles from "./index.module.css";

import { Character } from "../types";

type HomeProps = {
  characters: Character[];
};

export default function Home({ characters }: HomeProps): JSX.Element {
  const [session] = useSession();
  return (
    <Layout>
      <h1 className={styles.title}>Welcome to Idle RPG</h1>
      {!session ? (
        <p className={styles.description}>
          Start by logging in with your GitHub account.
        </p>
      ) : (
        <div className={styles.grid}>
          {characters.map(({ id, name, level }) => (
            <Link key={id} href={`/characters/${encodeURIComponent(id)}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className={styles.card}>
                <h3>{name}</h3>
                <p>Level {level}</p>
              </a>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { props: {} };
  }
  const characters = await findCharactersByUserEmail(session?.user.email);
  return { props: { session, characters } };
};
