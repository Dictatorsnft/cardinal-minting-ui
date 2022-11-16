import type { IconKey } from 'common/Socials'
import type { TradeButtonOptions } from 'components/TradeButtons'
import type React from 'react'

export type Colors = {
  accent: string
  glow: string
}

export type Badge = {
  badgeType: 'recent' | 'trending' | 'expiration' | 'wrapped' | 'unwrapped'
  position?: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
  content?: JSX.Element | string
}

export type Phase = {
  tooltip?: React.ReactNode
  title: React.ReactNode
  subtitle: React.ReactNode
  description: React.ReactNode
  allowlist?: {
    gatekeeperNetwork?: string
    expireOnUse?: boolean
  }
  whitelistMintSettings?: {
    mint?: string
  }
  payment?: {
    paymentMint?: string
    paymentAmount: number
  }
  goLiveSeconds?: number
  endSeconds?: number
}

export type ProjectConfig = {
  hidden?: boolean
  indexMetadataDisabled?: boolean
  name: string
  displayName: string
  websiteUrl: string
  hero?: string
  description?: string
  hostname?: string
  twitterHandle?: string
  socialLinks?: {
    icon: IconKey
    link: string
  }[]
  hideElligibility?: boolean
  goLiveSeconds?: number
  tradeButtons?: TradeButtonOptions[]
  logoImage?: string
  logoPadding?: boolean
  colors: Colors
  sponsors?: string[]
  badges?: Badge[]
  mintImages?: string[]
  phases?: Phase[]
  candyMachineId?: string
}

export const LISTING_AUTHORITY_NAME = 'global'

export const projectConfigs: { [key: string]: ProjectConfig } = {
  bat: {
    name: 'Battle To Earn',
    displayName: 'Battle To Earn',
    description: `10000 nuclear grade warloads to open your access to nuketopia with game characters, base weapons and inventory item drops.`,
    logoImage: 'warloads.ico',
    websiteUrl: '',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/Wnc9vyYfDB',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/DictatorsNFT_',
      },
    ],
    colors: {
      accent: '#000000',
      glow: '##EBA300',
    },
    sponsors: ['/logos/bat.png', '/logos/brave.png', '/logos/magic-eden.svg'],
    tradeButtons: ['hyperspace'],
    mintImages: ['brave/brave-0.png', 'brave/brave-1.png', 'brave/brave-2.png'],
    candyMachineId: '8eAEcEoz94ZqZroKyHWtTSCN93y4341QumaNgfSEsouP',
    // goLiveSeconds: 1668099600,
    // phases: [
    //   {
    //     tooltip: 'Must hold an Adam Ape NFT',
    //     title: 'Phase I',
    //     subtitle: 'Adam Ape NFT holders',
    //     description: '',
    //     allowlist: {
    //       gatekeeperNetwork: 'GnBuHefsQasF2spzZNkqQGN6AstFo9VEtrmmVPsbN6d3',
    //       expireOnUse: true,
    //     },
    //     whitelistMintSettings: {
    //       mint: '7fpz2iSx5PaLkppg4pQwp3C6XfpmaeYpFcoXnuoEZQ7H',
    //     },
    //     payment: {
    //       paymentMint: 'So11111111111111111111111111111111111111112',
    //       paymentAmount: 3000000000,
    //     },
    //     goLiveSeconds: 1668099600,
    //     endSeconds: 1668099600 + 60 * 30,
    //   },
    //   {
    //     tooltip: 'Mint using BAT token',
    //     title: 'Phase II',
    //     subtitle: 'Whitelist BAT Mint',
    //     description: '',
    //     allowlist: {
    //       gatekeeperNetwork: 'B21AQApRrSw9RrYLDdBC7RighbGY1CAsm2pRxczBPcNu',
    //       expireOnUse: true,
    //     },
    //     whitelistMintSettings: {
    //       mint: '7fpz2iSx5PaLkppg4pQwp3C6XfpmaeYpFcoXnuoEZQ7H',
    //     },
    //     payment: {
    //       paymentMint: 'EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz',
    //       paymentAmount: 20000000000,
    //     },
    //     goLiveSeconds: 1668099600 + 60 * 30,
    //     endSeconds: 1668099600 + 60 * 60,
    //   },
    //   {
    //     title: 'Phase III',
    //     subtitle: 'Whitelist SOL Mint',
    //     description: '',
    //     allowlist: {
    //       gatekeeperNetwork: 'B21AQApRrSw9RrYLDdBC7RighbGY1CAsm2pRxczBPcNu',
    //       expireOnUse: true,
    //     },
    //     whitelistMintSettings: {
    //       mint: '7fpz2iSx5PaLkppg4pQwp3C6XfpmaeYpFcoXnuoEZQ7H',
    //     },
    //     payment: {
    //       paymentAmount: 3000000000,
    //     },
    //     goLiveSeconds: 1668099600 + 60 * 60,
    //     endSeconds: 1668099600 + 60 * 120,
    //   },
    //   {
    //     title: 'Phase IV',
    //     subtitle: 'Public SOL Mint',
    //     description: '',
    //     allowlist: {},
    //     whitelistMintSettings: {},
    //     payment: {
    //       paymentAmount: 3000000000,
    //     },
    //     goLiveSeconds: 1668099600 + 60 * 120,
    //     endSeconds: 0,
    //   },
    // ],
  },

}
