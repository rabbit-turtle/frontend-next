import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>토끼와 거북이</title>
      </Head>
      <Link href={`/list`}>
        <a>안뇽</a>
      </Link>
    </>
  );
}
