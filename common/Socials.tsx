import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaMedium,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaBolt,
} from 'react-icons/fa'

export const SOCIALS = {
  discord: { icon: <FaDiscord />, link: 'https://discord.gg/Wnc9vyYfDB' },
  twitter: { icon: <FaTwitter />, link: 'https://twitter.com/DictatorsNFT_' },
  hyperspace: { icon: <FaBolt />, link: 'https://hyperspace.xyz/collection/3JnRBq3Gh1doxXDztb68iMLTnYcx3yWt3YrbQR8FJ8PV' },
}

export type IconKey =
  | 'discord'
  | 'twitter'
  | 'github'
  | 'medium'
  | 'web'
  | 'twitch'
  | 'facebook'
  | 'instagram'
  | 'tiktok'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  iconKey: IconKey
}

export const SocialIcon: React.FC<Props> = ({ iconKey }: Props) =>
  ({
    discord: <FaDiscord />,
    github: <FaGithub />,
    medium: <FaMedium />,
    twitter: <FaTwitter />,
    twitch: <FaTwitch />,
    facebook: <FaInstagram />,
    tiktok: <FaTiktok />,
    instagram: <FaFacebook />,
    web: <FaGlobe />,
    hyperspace: <FaBolt/>,
  }[iconKey])
