import { css } from '@emotion/react'
import { Banner } from 'common/Banner'
import { FooterSlim } from 'common/FooterSlim'
import { HeaderSlim } from 'common/HeaderSlim'
import { MintPage } from 'components/MintPage'
import Head from 'next/head'
import { useProjectConfig } from 'providers/ProjectConfigProvider'

import { useCallback, useEffect, useState } from 'react'
import * as anchor from '@project-serum/anchor'

import { Commitment, Connection, PublicKey, Transaction } from '@solana/web3.js'
import {
  useAnchorWallet,
  useConnection,
  useWallet
} from '@solana/wallet-adapter-react'
// import { WalletDialogButton } from '@solana/wallet-adapter-material-ui'
import {
  awaitTransactionSignatureConfirmation,
  CANDY_MACHINE_PROGRAM,
  CandyMachineAccount,
  createAccountsForMint,
  getCandyMachineState,
  getCollectionPDA,
  mintOneToken,
  SetupState
} from './candy-machine'
import {
  AlertState,
  formatNumber,
  getAtaForMint,
  toDate
} from '../config/utils'
// import { GatewayProvider } from '@civic/solana-gateway-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import { useCandyMachineId } from 'hooks/useCandyMachineId'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { notify } from 'common/Notification'
import { TradeButtons } from 'components/TradeButtons'

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey
  connection: anchor.web3.Connection
  txTimeout: number
  rpcHost: string
  network: string
  error?: string
}

export default function Home () {
  const { connection, environment } = useEnvironmentCtx()
  const { config } = useProjectConfig()
  const props: HomeProps = {
    candyMachineId: useCandyMachineId(),
    connection: connection,
    txTimeout: 60000,
    rpcHost: environment.primary,
    network: environment.label,
    error: undefined
  }
  const [isUserMinting, setIsUserMinting] = useState(false)
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>()
 
  const [isActive, setIsActive] = useState(false)
  const [endDate, setEndDate] = useState<Date>()
  const [itemsRemaining, setItemsRemaining] = useState<number>()
  const [isWhitelistUser, setIsWhitelistUser] = useState(false)
  const [isPresale, setIsPresale] = useState(false)
  const [isValidBalance, setIsValidBalance] = useState(false)
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>()
  const [needTxnSplit, setNeedTxnSplit] = useState(true)
  const [setupTxn, setSetupTxn] = useState<SetupState>()

  const anchorWallet = useAnchorWallet()
  const { connect, connected, publicKey, wallet } = useWallet()

  const refreshCandyMachineState = async (
    commitment: Commitment = 'confirmed'
  ) => {
    if (!publicKey) {
      return
    }
    if (props.error !== undefined) {
      notify({
        message: `Something went wrong!`,
        description: `${props.error}`,
        type: 'error'
      })
      return
    }

    const connection = new Connection(props.rpcHost, commitment)
    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet as anchor.Wallet,
          props.candyMachineId,
          connection
        )
        console.log('Candy machine state: ', cndy)
        let active = cndy?.state.goLiveDate
          ? cndy?.state.goLiveDate.toNumber() < new Date().getTime() / 1000
          : false
        let presale = false

        // duplication of state to make sure we have the right values!
        let isWLUser = false
        let userPrice = cndy.state.price

        // whitelist mint?
        if (cndy?.state.whitelistMintSettings) {
          // is it a presale mint?
          if (
            cndy.state.whitelistMintSettings.presale &&
            (!cndy.state.goLiveDate ||
              cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
          ) {
            presale = true
          }
          // is there a discount?
          if (cndy.state.whitelistMintSettings.discountPrice) {
            setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice)
            userPrice = cndy.state.whitelistMintSettings.discountPrice
          } else {
            setDiscountPrice(undefined)
            // when presale=false and discountPrice=null, mint is restricted
            // to whitelist users only
            if (!cndy.state.whitelistMintSettings.presale) {
              cndy.state.isWhitelistOnly = true
            }
          }
          // retrieves the whitelist token
          const mint = new anchor.web3.PublicKey(
            cndy.state.whitelistMintSettings.mint
          )
          const token = (await getAtaForMint(mint, publicKey))[0]

          try {
            const balance = await connection.getTokenAccountBalance(token)
            isWLUser = parseInt(balance.value.amount) > 0
            // only whitelist the user if the balance > 0
            setIsWhitelistUser(isWLUser)

            if (cndy.state.isWhitelistOnly) {
              active = isWLUser && (presale || active)
            }
          } catch (e) {
            setIsWhitelistUser(false)
            // no whitelist user, no mint
            if (cndy.state.isWhitelistOnly) {
              active = false
            }
            console.log('There was a problem fetching whitelist token balance')
            console.log(e)
          }
        }
        userPrice = isWLUser ? userPrice : cndy.state.price

        if (cndy?.state.tokenMint) {
          // retrieves the SPL token
          const mint = new anchor.web3.PublicKey(cndy.state.tokenMint)
          const token = (await getAtaForMint(mint, publicKey))[0]
          try {
            const balance = await connection.getTokenAccountBalance(token)

            const valid = new anchor.BN(balance.value.amount).gte(userPrice)

            // only allow user to mint if token balance >  the user if the balance > 0
            setIsValidBalance(valid)
            active = active && valid
          } catch (e) {
            setIsValidBalance(false)
            active = false
            // no whitelist user, no mint
            console.log('There was a problem fetching SPL token balance')
            console.log(e)
          }
        } else {
          const balance = new anchor.BN(await connection.getBalance(publicKey))
          const valid = balance.gte(userPrice)
          setIsValidBalance(valid)
          active = active && valid
        }

        // datetime to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.date) {
          setEndDate(toDate(cndy.state.endSettings.number))
          if (
            cndy.state.endSettings.number.toNumber() <
            new Date().getTime() / 1000
          ) {
            active = false
          }
        }
        // amount to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.amount) {
          const limit = Math.min(
            cndy.state.endSettings.number.toNumber(),
            cndy.state.itemsAvailable
          )
          if (cndy.state.itemsRedeemed < limit) {
            setItemsRemaining(limit - cndy.state.itemsRedeemed)
          } else {
            setItemsRemaining(0)
            cndy.state.isSoldOut = true
          }
        } else {
          setItemsRemaining(cndy.state.itemsRemaining)
        }

        if (cndy.state.isSoldOut) {
          active = false
        }

        const [collectionPDA] = await getCollectionPDA(props.candyMachineId)
        const collectionPDAAccount = await connection.getAccountInfo(
          collectionPDA
        )

        setIsActive((cndy.state.isActive = active))
        setIsPresale((cndy.state.isPresale = presale))
        setCandyMachine(cndy)

        const txnEstimate =
          892 +
          (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
          (cndy.state.tokenMint ? 66 : 0) +
          (cndy.state.whitelistMintSettings ? 34 : 0) +
          (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 34 : 0) +
          (cndy.state.gatekeeper ? 33 : 0) +
          (cndy.state.gatekeeper?.expireOnUse ? 66 : 0)

        setNeedTxnSplit(txnEstimate > 1230)
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === `Account does not exist ${props.candyMachineId}`) {
            notify({
              message: `Something went wrong!`,
              description: `Couldn't fetch candy machine state from candy machine with address: ${props.candyMachineId}, using rpc: ${props.rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value wrong in your .env file, or you are using the wrong RPC!`,
              type: 'error'
            })
          } else if (e.message.startsWith('failed to get info about account')) {
            notify({
              message: `Something went wrong!`,
              description: `Couldn't fetch candy machine state with rpc: ${props.rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
              type: 'error'
            })
          }
        } else {
          notify({
            message: `Something went wrong!`,
            description: `${e}`,
            type: 'error'
          })
        }
        console.log(e)
      }
    } else {
      notify({
        message: `Something went wrong!`,
        description: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
        type: 'error'
      })
    }
  }

  const onMint = async () => {
    let beforeTransactions: Transaction[] = []
    let afterTransactions: Transaction[] = []
    try {
      setIsUserMinting(true)
      if (connected && candyMachine?.program && publicKey) {
        let setupMint: SetupState | undefined
        if (needTxnSplit && setupTxn === undefined) {
          notify({
            message: `Alarm`,
            description: `Please sign account setup transaction`,
            type: 'info'
          })

          setupMint = await createAccountsForMint(candyMachine, publicKey)
          let status: any = { err: true }
          if (setupMint.transaction) {
            status = await awaitTransactionSignatureConfirmation(
              setupMint.transaction,
              props.txTimeout,
              props.connection,
              true
            )
          }
          if (status && !status.err) {
            setSetupTxn(setupMint)

            notify({
              message: `Alarm`,
              description: `Setup transaction succeeded! Please sign minting transaction`,
              type: 'info'
            })
          } else {
            notify({
              message: `Someting went wrong`,
              description: `Mint failed! Please try again!`,
              type: 'error'
            })

            setIsUserMinting(false)
            return
          }
        } else {
          notify({
            message: `Alarm`,
            description: `Please sign minting transaction`,
            type: 'info'
          })
        }

        const mintResult = await mintOneToken(
          candyMachine,
          publicKey,
          beforeTransactions,
          afterTransactions,
          setupMint ?? setupTxn
        )

        let status: any = { err: true }
        let metadataStatus = null
        if (mintResult) {
          status = await awaitTransactionSignatureConfirmation(
            mintResult.mintTxId,
            props.txTimeout,
            props.connection,
            true
          )

          metadataStatus = await candyMachine.program.provider.connection.getAccountInfo(
            mintResult.metadataKey,
            'processed'
          )
          console.log('Metadata status: ', !!metadataStatus)
        }

        if (status && !status.err && metadataStatus) {
          // manual update since the refresh might not detect
          // the change immediately
          const remaining = itemsRemaining! - 1
          setItemsRemaining(remaining)
          setIsActive((candyMachine.state.isActive = remaining > 0))
          candyMachine.state.isSoldOut = remaining === 0
          setSetupTxn(undefined)
          notify({
            message: `Congratulations! Mint succeeded!`,
            description: `${mintResult?.mintTxId}`,
            type: 'success'
          })
          refreshCandyMachineState('processed')
        } else if (status && !status.err) {
          notify({
            message: `Something went wrong with buying the token`,
            description: `Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.`,
            type: 'error'
          })

          refreshCandyMachineState()
        } else {
          notify({
            message: `Something went wrong with buying the token`,
            description: `Mint failed! Please try again!`,
            type: 'error'
          })

          refreshCandyMachineState()
        }
      }
    } catch (e) {
      let error: any = e
      let message = error.msg || 'Minting failed! Please try again!'
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction timeout! Please try again.'
        } else if (error.message.indexOf('0x137')) {
          console.log(error)
          message = `SOLD OUT!`
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`
        }
      } else {
        if (error.code === 311) {
          console.log(error)
          message = `SOLD OUT!`
          window.location.reload()
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`
        }
      }

      notify({
        message: `Something went wrong with buying the token`,
        description: message,
        type: 'error'
      })

      // updates the candy machine state to reflect the latest
      // information on chain
      refreshCandyMachineState()
    } finally {
      setIsUserMinting(false)
    }
  }

  const load = () => {
    setInterval(() => {
      refreshCandyMachineState()
    }, 20000)
  }

  useEffect(() => {
    console.log('====1===')
    refreshCandyMachineState()
    load()
  }, [publicKey])

  return (
    <div
      className='relative z-0 min-h-screen bg-dark-5 flex flex-col'
      // style={{ backgroundImage: `url(/bg.gif)` }}
    >
      <div
        className='blur-4xl absolute left-8 top-52 -z-10 h-[120px] w-[400px] -rotate-[60deg] bg-glow blur-[100px]'
        css={css`
          background: ${config.colors.glow} !important;
        `}
      />
      <div
        className='blur-4xl absolute -right-20 top-72 -z-10 h-[100px] w-[550px] -rotate-[60deg] bg-glow blur-[120px]'
        css={css`
          background: ${config.colors.glow} !important;
        `}
      />
      <Head>
        <title>{config.displayName}</title>
        <link rel='icon' href='/warloads.ico' />

        <link
          href='https://fonts.googleapis.com/css2?family=Roboto&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Lato:wght@100&display=swap'
          rel='stylesheet'
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Kanit:ital@0;1&family=Oswald:wght@200;300;400;500&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Karla:wght@600&display=swap'
          rel='stylesheet'
        />
      </Head>
      <Banner />
      <HeaderSlim />
      <div style={{ minHeight: 'calc(100vh - 337px)' }} className='grow'>
        <MintPage onMint={onMint} />
      </div>
      <FooterSlim />
    </div>
  )
}
