import { Avatar, AvatarImage } from './ui/avatar'

export const SiteLogo = () => {
  const { meta } = useMisskeyGlobal()
  return (
    <Avatar className="rounded-none">
      <AvatarImage src={meta.logoImageUrl || meta.iconUrl || '/favion.ico'} />
    </Avatar>
  )
}
