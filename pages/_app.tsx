import { AppProps } from "next/app";
import { Provider } from "next-auth/client";

import "../styles/globals.css";

const isSSR = () => typeof window === "undefined";

/**
 * Accessibility tool: Outputs to devtools console on dev only and client-side only.
 * @see https://github.com/dequelabs/react-axe/issues/125
 */
if (process.env.NODE_ENV !== "production" && !isSSR()) {
  const React = require("react"); // eslint-disable-line
  const DOM = require("react-dom"); // eslint-disable-line
  const axe = require("react-axe"); // eslint-disable-line
  axe(React, DOM, 1000);
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
