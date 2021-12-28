import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Head>
        <title>Seed Sniper</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@ajwaxman" />
        <meta property="og:url" content="/seed-sniper.png" />
        <meta property="og:title" content="🌱 Seed Sniper" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <meta
          property="og:description"
          content="See the floor price of long looping Terraforms."
        />
        <meta property="og:image" content="/seed-sniper.png" />
      </Head>
    </>
  )
}

export default MyApp
