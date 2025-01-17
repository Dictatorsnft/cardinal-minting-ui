import { Button } from 'common/Button'
import { Tooltip } from 'common/Tooltip'
import { useHandleMint } from 'handlers/useHandleMint'
import { useCandyMachineData } from 'hooks/useCandyMachineData'
import { isValid, useGatewayToken } from 'hooks/useGatewayToken'
import { useWalletId } from 'hooks/useWalletId'
import { useWhitelistTokenAccount } from 'hooks/useWhitelistTokenAccount'
import { useProjectConfig } from 'providers/ProjectConfigProvider'
import { useUTCNow } from 'providers/UTCNowProvider'

export const MintButton = ({ onMint }: any) => {
  const handleMint = useHandleMint()
  const { config } = useProjectConfig()

  const walletId = useWalletId()
  const candyMachineData = useCandyMachineData()
  const gatewayToken = useGatewayToken(
    candyMachineData.data?.data.gatekeeper?.gatekeeperNetwork
  )
  const whitelistMint = candyMachineData.data?.data.whitelistMintSettings?.mint
  const whitelistTokenAccount = useWhitelistTokenAccount(whitelistMint)
  const { UTCNow } = useUTCNow()
  const activePhase = config.phases?.find(
    (p) =>
      UTCNow > (p.goLiveSeconds ?? 0) &&
      (p.endSeconds === 0 || UTCNow < (p.endSeconds ?? 0)) &&
      (!p.payment?.paymentMint ||
        p.payment?.paymentMint ===
          candyMachineData.data?.tokenMint?.toString()) &&
      (!p.payment?.paymentAmount ||
        (p.payment?.paymentAmount ?? 0) ===
          parseInt(candyMachineData.data?.data.price.toString() ?? '0'))
  )
  const disabled =
    !candyMachineData.data ||
    candyMachineData.data.itemsRedeemed.toString() ===
      candyMachineData.data.data.itemsAvailable.toString() ||
    !walletId ||
    (!!candyMachineData.data?.data.gatekeeper && !isValid(gatewayToken.data)) ||
    (!!candyMachineData.data?.data.whitelistMintSettings &&
      (whitelistTokenAccount.data?.amount.toNumber() ?? 0) <= 0)
  return (
    <Tooltip
      className='w-full cursor-pointer'
      tooltip={
        disabled
          ? 'Wallet not elligible to mint during phase. Check whitelist.'
          : 'Mint 1 token'
      }
    >
      <Button
        className='w-full justify-center'
        loading={handleMint.isLoading}
        inlineLoader
        disabled={disabled}
        onClick={onMint}
      >
        {config.logoImage && (
          <img
            className='mr-1 w-4'
            src={config.logoImage}
            alt={config.displayName}
          />
        )}
        Mint
      </Button>
    </Tooltip>
  )
}
