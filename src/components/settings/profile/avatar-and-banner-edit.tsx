import { MkAvatar } from '@/components/mk-avatar';
import { MkFileUploadMenu } from '@/components/mk-file-upload-menu';
import { MkUserCardBanner } from '@/components/mk-user-card';
import { Button } from '@/components/ui/button';
import { useProfileEditAction } from '@/hooks/use-profile-edit-actions';
import { useMe } from '@/stores/me';
import { AwardIcon, ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function AvatarAndBannerEdit() {
  const me = useMe();
  const { t } = useTranslation();

  const { mutate } = useProfileEditAction();

  return (
    <div className="edit-avatar-and-banner bg-card relative overflow-hidden rounded-lg border">
      <MkFileUploadMenu
        onUpload={async (promise) => {
          const file = await promise[0];
          mutate({ bannerId: file.id });
        }}
        label={t('banner')}
        limit={1}
      >
        <Button className="absolute top-3 left-3 z-10">
          <ImageIcon /> {t('_profile.changeBanner')}
        </Button>
      </MkFileUploadMenu>
      <MkUserCardBanner url={me.bannerUrl} blurhash={me.bannerBlurhash} className="h-48 border-b" />
      <MkAvatar
        user={me}
        className="absolute top-32 left-1/2 size-30 -translate-x-1/2"
        avatarProps={{ className: 'size-30' }}
      />
      <div className="flex items-center justify-center gap-3 p-4 pt-18">
        <MkFileUploadMenu
          onUpload={async (promise) => {
            const file = await promise[0];
            mutate({ avatarId: file.id });
          }}
          label={t('avatar')}
          limit={1}
        >
          <Button>
            <ImageIcon /> {t('_profile.changeAvatar')}
          </Button>
        </MkFileUploadMenu>
        <Button
          onClick={() => {
            toast.info('not implemented');
          }}
        >
          <AwardIcon /> {t('decorate')}
        </Button>
      </div>
    </div>
  );
}
