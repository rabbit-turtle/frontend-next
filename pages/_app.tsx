import type { AppProps } from "next/app";
import Head from "next/head";
import Template from "components/template";
import "styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Template>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>

      <Component {...pageProps} />
    </Template>
  );
}

export default MyApp;
