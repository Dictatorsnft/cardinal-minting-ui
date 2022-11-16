import { css } from '@emotion/react'
import { useCandyMachineData } from 'hooks/useCandyMachineData'
import { useProjectConfig } from 'providers/ProjectConfigProvider'
import { useUTCNow } from 'providers/UTCNowProvider'

export const MintSupply = () => {
  const candyMachineData = useCandyMachineData()
  const { config } = useProjectConfig()
  const { UTCNow } = useUTCNow()
  // console.log(candyMachineData, 'candyMachineData.data')

  const pct =
    (parseInt(candyMachineData.data?.itemsRedeemed.toString() || '') ?? 0) /
    (parseInt(candyMachineData.data?.data.maxSupply.toString() || '') ?? 0)
  if (config.goLiveSeconds && UTCNow < config.goLiveSeconds) return <></>
  return (
    <>
      <div className='relative h-8 w-full overflow-hidden rounded-xl bg-white bg-opacity-10'>
        <div
          className='absolute h-full bg-primary'
          css={css`
            width: ${pct * 100}%;
          `}
        />
        <div className='absolute flex h-full w-full items-center justify-center gap-2 text-sm'>
          <div>{candyMachineData.data?.itemsRedeemed.toString() ?? 0}</div>
          <div>/</div>
          {candyMachineData.data ? (
            candyMachineData.data?.data.itemsAvailable.toString()
          ) : (
            <div className='h-2/3 w-8 animate-pulse rounded-lg bg-border'></div>
          )}
        </div>

        <div className='absolute right-5 flex h-full items-center text-sm'>
          <div className='h-2 w-2 animate-ping rounded-full bg-light-0' />
        </div>
      </div>

      <div className='relative h-8 w-full overflow-hidden rounded-xl bg-white bg-opacity-10'>
        <div
          className='absolute h-full bg-primary'
          css={css`
            width: ${pct * 100}%;
          `}
        />
        <div className='absolute flex h-full w-full items-center justify-center gap-2 text-sm'>
          {candyMachineData.data ? (
            <>{Number(candyMachineData.data?.data.price) / 10 ** 9} SOL</>
          ) : (
            <div className='h-2/3 w-8 animate-pulse rounded-lg bg-border'></div>
          )}
        </div>

        <div className='absolute right-5 flex h-full items-center text-sm'>
          <div className='h-2 w-2 animate-ping rounded-full bg-light-0' />
        </div>
      </div>
    </>
  )
}
