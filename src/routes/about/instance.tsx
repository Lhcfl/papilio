import { MisskeyIcon } from '@/components/icons/misskey-icon';
import { MkMention } from '@/components/mk-mention';
import { MkMfm } from '@/components/mk-mfm';
import { MkUrl } from '@/components/mk-url';
import { MkUserCardBanner } from '@/components/mk-user-card';
import { SiteLogo } from '@/components/site-logo';
import { Separator } from '@/components/ui/separator';
import { PageTitle } from '@/layouts/sidebar-layout';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryClient } from '@/plugins/persister';
import { useNodeInfo } from '@/stores/node-info';
import { useSiteMeta } from '@/stores/site';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { InfoIcon, ListCheckIcon } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import sanitizeHtml from 'sanitize-html';

const statsQueryOpts = queryOptions({
  queryKey: ['stats'],
  queryFn: () => misskeyApi('stats', {}),
});

export const Route = createFileRoute('/about/instance')({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(statsQueryOpts),
});

function RouteComponent() {
  const software = useNodeInfo((n) => n.software);
  const meta = useSiteMeta((s) => s);
  const descriptionSanitized = sanitizeHtml(meta.description ?? '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  });

  const { data: stats } = useSuspenseQuery(statsQueryOpts);

  const { t } = useTranslation();

  return (
    <div className="p-2">
      <PageTitle title={t('about')} />
      <div className="relative overflow-hidden rounded-md border">
        <MkUserCardBanner url={meta.bannerUrl} blurhash={null} className="h-48" />
        <SiteLogo className="absolute top-24 left-1/2 size-32 -translate-x-1/2 rounded-md" />
        <div className="mt-8 flex justify-center pb-3">
          <h2 className="text-2xl font-bold">{meta.name}</h2>
        </div>
      </div>
      <div className="about mt-2">
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold">
          <InfoIcon className="size-6" /> {t('about')}
        </h3>
        <div
          className="**:not-[img]:[all:revert] [&_img]:inline"
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{ __html: descriptionSanitized }}
        />
      </div>
      <Separator className="my-3" />
      <div>
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold">
          <ListCheckIcon className="size-6" /> {t('serverRules')}
        </h3>
        <div>
          {meta.serverRules.map((rule, index) => (
            // eslint-disable-next-line react-x/no-array-index-key
            <div className="mt-3 flex items-start gap-2" key={index}>
              <div className="text-background bg-foreground relative mt-0.5 min-h-5 min-w-5 flex-[0_0] rounded-full border">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">{index + 1}</span>
              </div>
              <div>{rule}</div>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-3" />
      <div>
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold">
          <InfoIcon className="size-6" /> {t('instanceInfo')}
        </h3>
        <div>
          {meta.maintainerName && (
            <AboutInfoItem name={t('administrator')} value={<MkMention username={meta.maintainerName} host={null} />} />
          )}
          {meta.maintainerEmail && (
            <AboutInfoItem
              name={t('contact')}
              value={<MkUrl url={`mailto:${meta.maintainerEmail}`}>{meta.maintainerEmail}</MkUrl>}
            />
          )}
          {meta.tosUrl && <AboutInfoItem name={t('termsOfService')} value={<MkMfm text={meta.tosUrl} />} />}
          <AboutInfoItem name={t('user')} value={stats.originalUsersCount} />
          <AboutInfoItem name={t('notes')} value={stats.originalNotesCount} />
          <AboutInfoItem name={`${t(`users`)} (${t(`remote`)} + ${t(`local`)})`} value={stats.usersCount} />
          <AboutInfoItem name={`${t(`notes`)} (${t(`remote`)} + ${t(`local`)})`} value={stats.notesCount} />
          <AboutInfoItem name={t('federation')} value={stats.instances} />
        </div>
      </div>
      <Separator className="my-3" />
      <div>
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold">
          <MisskeyIcon className="bg-foreground text-background size-6 rounded-md p-1" /> Misskey
        </h3>
        <div>
          <AboutInfoItem name={t('software')} value={software.name} />
          <AboutInfoItem name={t('version')} value={software.version} />
          <AboutInfoItem name={t('sourceCode')} value={<MkUrl url={software.homepage} />} />
        </div>
      </div>
    </div>
  );
}

function AboutInfoItem({ name, value }: { name: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <span className="text-muted-foreground flex-[0_0_auto]">{name}</span>
      <span className="text-muted-foreground text-right">{value}</span>
    </div>
  );
}
