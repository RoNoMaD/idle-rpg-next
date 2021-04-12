import { GetServerSideProps } from "next";
import { Character } from "../../../types";

import { useSession, getSession } from "next-auth/client";

import { findCharacterById } from "@dao/characters";

import Layout from "@components/layout/layout";
import AccessDenied from "@components/access-denied";
import EditCharacter from "@components/edit-character";

type EditCharacterPageProps = {
  initialCharacter: Character;
};

export default function EditCharacterPage({
  initialCharacter,
}: EditCharacterPageProps): JSX.Element {
  const [session] = useSession();

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  return (
    <Layout>
      <EditCharacter initialCharacter={initialCharacter} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { props: {} };
  }
  const character = await findCharacterById(Number(context.params?.id) || -1);
  return { props: { initialCharacter: character, session } };
};
