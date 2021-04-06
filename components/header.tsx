import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [session, loading] = useSession();

  let left = null;

  let right = null;

  if (loading) {
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a data-active={isActive("/signup")}>Log in</a>
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="bold" data-active={isActive("/")}>
            Characters
          </a>
        </Link>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name}{" "}
          {session.user.email ? `(${session.user.email})` : null}
        </p>
        <Link href="/characters/create">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>New character</a>
        </Link>
        <button onClick={() => signOut()}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
    </nav>
  );
};

export default Header;
