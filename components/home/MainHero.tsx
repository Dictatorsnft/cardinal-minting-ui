import { GlyphPlus } from 'assets/GlyphPlus'
import { Button } from 'common/Button'
import { HeaderSlim } from 'common/HeaderSlim'
import { statsNameMapping, useGlobalStats } from 'hooks/useGlobalStats'
import { useRouter } from 'next/router'

export const MainHero = () => {
  const stats = useGlobalStats()
  const router = useRouter()
  return (
    <div className='relative z-0 text-sm'>
      <div className='blur-4xl absolute left-8 top-52 -z-10 h-[120px] w-[400px] -rotate-[60deg] bg-black blur-[100px]' />
      <div className='blur-4xl absolute -right-20 top-72 -z-10 h-[100px] w-[550px] -rotate-[60deg] bg-black blur-[120px]' />
      <HeaderSlim />
      <div className='flex flex-wrap justify-between gap-10 px-8 py-24 md:px-16'>
        <div className='flex flex-col gap-2'>
        </div>
        <div className='flex flex-col items-end justify-end gap-5 '>
          <div className='flex items-center gap-2 lg:gap-6'>
            <div className='text-lg text-medium-3'>
              Do not own a dictator yet?
            </div>
           <a href="https://hyperspace.xyz/collection/3JnRBq3Gh1doxXDztb68iMLTnYcx3yWt3YrbQR8FJ8PV"><Button
                // window.scrollTo({ top: 450, behavior: 'smooth' })
            >
              <>Buy On Hyperspace</>
              <img width={"25px"} src="/hyperspace.png" alt="" />
            </Button></a> 
          </div>
          <div className='flex w-fit flex-wrap gap-3 rounded-xl border-[2px] border-border p-4'>
            {statsNameMapping.map(({ displayName, key }) => (
              <div className='flex items-center gap-2' key={key}>
                <div className='text-medium-3'>{displayName}</div>
                <div className='text-light-0'>
                  {stats.data && stats.data[key] ? (
                    Number(stats.data[key]?.data).toLocaleString('en-US')
                  ) : (
                    <div className='mt-[1px] h-5 w-12 animate-pulse rounded-md bg-border' />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
