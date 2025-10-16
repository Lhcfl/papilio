import { useUsersQuery } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { useMe } from '@/stores/me';
import type { NoteWithExtension } from '@/types/note';
import { EyeOffIcon, HomeIcon, LockIcon, MailIcon, MapPinIcon } from 'lucide-react';
import type { HTMLProps } from 'react';
import { Spinner } from '../ui/spinner';
import { MkAvatar } from '../mk-avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { useTranslation } from 'react-i18next';
import { MkUserName } from '../mk-user-name';
import { acct } from 'misskey-js';
import type { User } from 'misskey-js/entities.js';

export const MkVisibilityIcon = (
  props: { note: NoteWithExtension; iconProps?: HTMLProps<SVGSVGElement> } & HTMLProps<HTMLDivElement>,
) => {
  const { note, className, iconProps, ...rest } = props;
  const meId = useMe((me) => me.id);
  const isPrivate = ![...(note.visibleUserIds ?? []), note.user.id].some((x) => x !== meId);
  const isLocalOnly = note.localOnly;

  if (note.visibility === 'public' && !isLocalOnly) return null;

  return (
    <div className={cn('mk-visibility-icon flex gap-0.5', className)} {...rest}>
      {isLocalOnly && <MapPinIcon {...iconProps} />}
      {note.visibility === 'home' && <HomeIcon {...iconProps} />}
      {note.visibility === 'followers' && <LockIcon {...iconProps} />}
      {note.visibility === 'specified' &&
        (isPrivate ? (
          <EyeOffIcon {...iconProps} />
        ) : (
          <HoverCard>
            <HoverCardTrigger>
              <MailIcon {...iconProps} />
            </HoverCardTrigger>
            <HoverCardContent>
              <VisibleUsersPopup note={note} />
            </HoverCardContent>
          </HoverCard>
        ))}
    </div>
  );
};

const VisibleUsersPopup = (props: { note: NoteWithExtension }) => {
  const { note } = props;
  const { data: users, isPending } = useUsersQuery(note.visibleUserIds);
  const me = useMe();
  const { t } = useTranslation();

  const uniqueUsers = new Map<string, User>();
  uniqueUsers.set(me.id, me);
  users?.forEach((u) => uniqueUsers.set(u.id, u));
  uniqueUsers.set(note.user.id, note.user);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MailIcon className="size-3" />
        {t('recipient')}
      </div>
      {isPending && <Spinner />}
      {[...uniqueUsers.values()].map((u) => (
        <div key={u.id} className="flex items-center gap-2 border-t pt-2">
          <MkAvatar key={u.id} user={u} />
          <div className="flex flex-col">
            <MkUserName user={u} className="line-clamp-1 text-sm" />
            <span className="text-sm text-muted-foreground line-clamp-1">@{acct.toString(u)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
