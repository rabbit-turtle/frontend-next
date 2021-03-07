import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.cookie = `token=mengkki`;
  }, []);

  return (
    <>
      <Head>
        <title>토끼와 거북이</title>
      </Head>
      <div>안뇽</div>
    </>
  );
}
