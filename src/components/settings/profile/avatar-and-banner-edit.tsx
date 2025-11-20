import { MkAvatar } from '@/components/mk-avatar';
import { MkFileUploadMenu } from '@/components/mk-file-upload-menu';
import { MkUserCardBanner } from '@/components/mk-user-card';
import { Button } from '@/components/ui/button';
import { useMe } from '@/stores/me';
import { AwardIcon, ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function AvatarAndBannerEdit() {
  const me = useMe();
  const { t } = useTranslation();

  return (
    <div className="edit-avatar-and-banner bg-card relative overflow-hidden rounded-lg border">
      <MkFileUploadMenu onUpload={() => toast.info('not implemented')} label={t('banner')}>
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
        <MkFileUploadMenu onUpload={() => toast.info('not implemented')} label={t('avatar')}>
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
