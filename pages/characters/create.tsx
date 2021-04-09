import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";

import { createCharacter } from "@api-client/characters/characters-api";
import AccessDenied from "@components/access-denied";

const CreateCharacter: React.FC = () => {
  const [session] = useSession();

  const router = useRouter();
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  const submitData = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (name !== "") {
      try {
        await createCharacter(name);
        router.push("/");
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    } else {
      setError("Please type a name !");
    }
  };

  return (
    <Layout>
      <form onSubmit={submitData} method="POST" action="/api/characters">
        <h1>New Character</h1>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          onChange={(e) => {
            setError("");
            setName(e.target.value);
          }}
          placeholder="Balrog"
          type="text"
          value={name}
          required
        />
        <button disabled={!name} type="submit">
          Create
        </button>
        {error !== "" ? <div>{error}</div> : null}
      </form>
    </Layout>
  );
};

export default CreateCharacter;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: { session },
  };
};
