import { Avatar, AvatarImage } from './ui/avatar'

export const SiteLogo = () => {
  const logoImageUrl = useSiteMeta(m => m.logoImageUrl)
  const iconUrl = useSiteMeta(m => m.iconUrl)
  const faviconUrl = getRelativeUrl('/favicon.ico')
  return (
    <Avatar className="rounded-none">
      <AvatarImage src={logoImageUrl || iconUrl || faviconUrl} />
    </Avatar>
  )
}
