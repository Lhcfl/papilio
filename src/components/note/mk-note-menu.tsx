import { BellOffIcon, CopyIcon, ExternalLinkIcon, FlagIcon, InfoIcon, LanguagesIcon, LinkIcon, PaperclipIcon, ShareIcon, StarIcon, Trash2Icon } from 'lucide-react'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { NoteWithExtension } from '@/types/note'

export const MkNoteMenu = (props: { note: NoteWithExtension }) => {
  const { t } = useTranslation()
  const { note } = props
  const meId = useMe(s => s.me?.id)
  const isAdmin = useMe(s => s.me?.isAdmin)

  const isMine = meId === note.userId

  return (
    <DropdownMenuContent align="start">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-sm text-muted-foreground">{t('note')}</DropdownMenuLabel>
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
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <StarIcon />
          {t('favorite')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PaperclipIcon />
          {t('clip')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BellOffIcon />
          {t('muteThread')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      {(!isMine) && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FlagIcon />
              {t('reportAbuse')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
      {(isMine || isAdmin) && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
    </DropdownMenuContent>
  )
}
