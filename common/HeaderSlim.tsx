import { AccountConnect } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GlyphWallet } from 'assets/GlyphWallet'
import { LogoTitled } from 'assets/LogoTitled'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'

import { ButtonSmall } from './ButtonSmall'
import { asWallet } from './wallets'

export const HeaderSlim = () => {
  const router = useRouter()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { secondaryConnection, environment } = useEnvironmentCtx()
  const [tab, setTab] = useState<string>('browse')

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    if (anchor !== tab) setTab(anchor || 'browse')
  }, [router.asPath, tab])

  return (
    <div className='w-full px-4 py-4'>
      <div className='flex min-h-[72px] flex-wrap items-center justify-center gap-4 rounded-xl bg-white bg-opacity-5 py-4 px-8 md:justify-between'>
        <div className='flex items-center gap-5'>
          <div
            className='flex cursor-pointer items-center transition-opacity'
            onClick={() => {
              router.push(`/${location.search}`)
            }}
          >
            <img src='/warloads.png' className='hover:opacity-60' width={"180px"}></img>
          </div>
          {environment.label !== 'mainnet-beta' && (
            <>
              <div className='text-primary'>{environment.label}</div>
            </>
          )}
        </div>
        <div className='hidden md:flex items-center"'>
          <button type="button" onClick={() => router.push('/#')} className='md:px-5 sm:2 rounded-md hover:bg-gray-600 outline-ring-gray-300 ...'>
           HOME
          </button>
          <button disabled className='text-slate-400 md:px-5 sm:2'>
            STAKE
          </button>
          <button type="button" onClick={() => router.push('/upgrade')} className='md:px-5 sm:2 rounded-md hover:bg-gray-600 outline-ring-gray-300 ...'>
            UPGRADE
          </button>
          <button disabled className='text-slate-400 md:px-5 sm:2'>
            EXPLORE
          </button>
          <button type="button" onClick={() => router.push('/nuketopia')} className='md:px-5 sm:2 border-solid border-2 border-gray-500 rounded-md  hover:bg-gray-600 outline-ring-gray-300 active:bg-gray-600...'>NUKETOPIA</button>
          <button disabled className='text-slate-400 md:px-5 sm:2'>
            GUILD
          </button>
          <button disabled className='text-slate-400 text-slate-400md:px-5 sm:2'>
            MERCH
          </button>
        </div>
        <div className='flex-5 flex items-center justify-end gap-6 '>
          {wallet.connected && wallet.publicKey ? (
            <AccountConnect
              dark={true}
              connection={secondaryConnection}
              environment={environment.label}
              handleDisconnect={() => wallet.disconnect()}
              wallet={asWallet(wallet)}
            />
          ) : (
            <ButtonSmall
              className='text-xs'
              onClick={() => walletModal.setVisible(true)}
            >
              <>
                <GlyphWallet />
                <>Connect wallet</>
              </>
            </ButtonSmall>
          )}
        </div>
      </div>
    </div>
  )
}
