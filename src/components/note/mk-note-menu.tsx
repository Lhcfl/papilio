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
          <InfoIcon />
          {t('details')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          {t('copyContent')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LinkIcon />
          {t('copyLink')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LinkIcon />
          {t('copyRemoteLink')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLinkIcon />
          {t('showOnRemote')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShareIcon />
          {t('share')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LanguagesIcon />
          {t('translate')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </DropdownMenuContent>
  )
}
