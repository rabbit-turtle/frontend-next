import type { AppProps } from 'next/app';
import Head from 'next/head';
import Template from 'components/template';
import Theme from 'styles/Theme';
import 'styles/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Template>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <Theme>
        <Component {...pageProps} />
      </Theme>
    </Template>
  );
}

export default MyApp;
