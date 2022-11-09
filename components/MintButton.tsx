import { Button } from 'common/Button'
import { Tooltip } from 'common/Tooltip'
import { useHandleMint } from 'handlers/useHandleMint'
import { useCandyMachineData } from 'hooks/useCandyMachineData'
import { isValid, useGatewayToken } from 'hooks/useGatewayToken'
import { useWalletId } from 'hooks/useWalletId'
import { useProjectConfig } from 'providers/ProjectConfigProvider'
import { useUTCNow } from 'providers/UTCNowProvider'

export const MintButton = () => {
  const handleMint = useHandleMint()
  const { config } = useProjectConfig()
  const walletId = useWalletId()
  const candyMachineData = useCandyMachineData()
  const gatewayToken = useGatewayToken(
    candyMachineData.data?.data.gatekeeper?.gatekeeperNetwork
  )
  const { UTCNow } = useUTCNow()
  const disabled =
    !candyMachineData.data ||
    !walletId ||
    (!!candyMachineData.data?.data.gatekeeper && !isValid(gatewayToken.data)) ||
    (!!config.goLiveSeconds && UTCNow < (config.goLiveSeconds ?? 0))
  return (
    <Tooltip
      className="w-full cursor-pointer"
      tooltip={
        disabled ? 'Wallet not elligible to mint during phase' : 'Mint 1 token'
      }
    >
      <Button
        className="w-full justify-center"
        loading={handleMint.isLoading}
        inlineLoader
        disabled={disabled}
        onClick={() => handleMint.mutate()}
      >
        {config.logoImage && (
          <img
            className="mr-1 w-4"
            src={config.logoImage}
            alt={config.displayName}
          />
        )}
        Mint
      </Button>
    </Tooltip>
  )
}
