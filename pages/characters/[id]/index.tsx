import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";

import { deleteCharacter } from "@api-client/characters/characters-api";

import Layout from "@components/layout/layout";
import AccessDenied from "@components/access-denied";

import styles from "./character.module.css";
import { findCharacterById } from "@dao/characters";

type CharacterProps = {
  id: number;
  name: string;
  level: number;
  skillPoints: number;
  health: number;
  attack: number;
  defense: number;
  magik: number;
  user: {
    name: string;
    email: string;
  };
};

export default function Character({
  id,
  name,
  level,
  skillPoints,
  health,
  attack,
  defense,
  magik,
}: CharacterProps): JSX.Element {
  const [session] = useSession();

  const router = useRouter();

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className={styles.title}>{name}</h1>

      <p className={styles.description}>Level: {level}</p>
      <p className={styles.description}>Skill points: {skillPoints}</p>
      <p className={styles.description}>Health: {health}</p>
      <p className={styles.description}>Attack: {attack}</p>
      <p className={styles.description}>Defense: {defense}</p>
      <p className={styles.description}>Magik: {magik}</p>
      <button type="button" onClick={() => router.back()}>
        Click here to go back
      </button>
      <Link href={`/characters/${id}/edit`}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>Edit</a>
      </Link>
      <button
        type="button"
        onClick={() => {
          deleteCharacter(id);
          router.push("/");
        }}
      >
        Delete
      </button>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { props: {} };
  }
  const character = await findCharacterById(Number(context.params?.id) || -1);
  return { props: { ...character, session } };
};
