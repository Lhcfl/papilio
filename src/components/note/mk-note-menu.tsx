import { CopyIcon, ExternalLinkIcon, InfoIcon, LanguagesIcon, LinkIcon, ShareIcon } from 'lucide-react'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { NoteWithExtension } from '@/types/note'

export const MkNoteMenu = (props: { note: NoteWithExtension }) => {
  const { t } = useTranslation()

  return (
    <DropdownMenuContent align="start">
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <InfoIcon></InfoIcon>
          {t('details')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon></CopyIcon>
          {t('copyContent')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LinkIcon></LinkIcon>
          {t('copyLink')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LinkIcon></LinkIcon>
          {t('copyRemoteLink')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLinkIcon></ExternalLinkIcon>
          {t('showOnRemote')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShareIcon></ShareIcon>
          {t('share')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LanguagesIcon></LanguagesIcon>
          {t('translate')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator></DropdownMenuSeparator>
    </DropdownMenuContent>
  )
}
