import Head from "next/head";
import "../styles/globals.css"; // Ensures styles are applied globally

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Google Font: Inter (Apple-like font) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
