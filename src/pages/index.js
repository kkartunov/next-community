import Head from 'next/head';
import Viewport from 'components/Viewport';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Viewport
        theme={{}}
      >
        <h1>Hello Next Community</h1>
      </Viewport>
    </div>
  )
}
