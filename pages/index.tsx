import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.cookie = `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbHU4bXEzNTAwMDFkNm94YnRnZ210aG0iLCJpYXQiOjE2MTQ4MjQ4NTd9.QRyt5ZRtvCs5ZY6MY-2dj4A1rt20arpCly56PoR2E3k`;
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
