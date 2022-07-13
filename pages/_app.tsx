import "../styles/globals.css";
import type { AppProps } from "next/app";
import Login from "./login";

function MyApp({ Component, pageProps }: AppProps) {
  const loggedInUser = false;

  if (!loggedInUser) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
