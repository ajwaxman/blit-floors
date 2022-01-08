import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Head>
        <title>Flipmap Floor Rankings</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@ajwaxman" />
        <meta property="og:url" content="https://www.blitfloor.xyz" />
        <meta property="og:image" content="https://www.blitfloor.xyz/blit-floor.png" />
        <meta property="og:title" content="🧹 Blitmap Floor Rankings" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <meta
          property="og:description"
          content="See the Blitmap floor price for all compositions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=1" />
        <meta property="og:image" content="/blit-floor.png" />
      </Head>
    </>
  )
}

export default MyApp
