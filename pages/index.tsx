import { FooterSlim } from 'common/FooterSlim'
import { MainHero } from 'components/home/MainHero'
import Head from 'next/head'

export function Placeholder() {
  return (
    <div className="h-[300px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
  )
  
}



function Home() {
  return (
    <div className="relative z-0 flex min-h-screen flex-col bg-cover" style={{ backgroundImage: `url(/bg.gif)` }}>
      <Head>
        <title>Dictators</title>
        <meta name="description" content="Supremacy" />
        <link rel="icon" href={'/favicon.ico'} />
        <script
          defer
          data-domain="cit.nukepad.io"
          src="https://plausible.io/js/plausible.js"
        />
        <meta name="og:title" content={`Dictators by NUKE Labs`} />
        <meta name="og:description" content="Dictators by NUKE Labs" />
        <meta property="og:url" content="https://cit.nukepad.io" />
        <meta
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/preview`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DictatorsNFT_" />
        <script
          defer
          data-domain="cit.nukepad.io"
          src="https://plausible.io/js/script.js"
        ></script>
      </Head>
      <MainHero />
      <div className="z-10 mx-auto mt-48 flex grow flex-col gap-24 px-8 md:px-16">
        <div className="flex w-full flex-col text-center">
          <div className="mb-2 text-3xl text-light-0">Nuklification</div>
          <div className="text-lg text-medium-3"></div>
          <div className="mb-4 text-base italic text-medium-3">
            Starts on 21st November...
          </div>
        </div>
      </div>
      
      <FooterSlim />
    </div>
    
  )
}

export default Home