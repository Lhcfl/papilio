/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderRightPortal } from '@/components/header-portal';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Progress } from '@/components/ui/progress';
import { type UserRelation } from '@/hooks/user';
import { errorMessageSafe } from '@/lib/error';
import { cn } from '@/lib/utils';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { CheckCheckIcon, MinusIcon, RefreshCw, UploadCloudIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkMention } from '@/components/mk-mention';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableHead, TableHeader, TableCell, TableRow } from '@/components/ui/table';
import { type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MkFileUploadMenu } from '@/components/mk-file-upload-menu';
import type { DriveFile } from '@/types/drive-file';

function RelationInfinityLoaderTable(props: { children: React.ReactNode; className?: string }) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead />
          <TableHead>{t('username')}</TableHead>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('createdAt')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{props.children}</TableBody>
    </Table>
  );
}

export function CommonRouteComponent<T extends UserRelation>({
  icon: Icon,
  query,
  bulkableAction,
  onUpload,
  actionName,
}: {
  icon: (props: { item: T }) => React.ReactNode;
  query: UseInfiniteQueryResult<InfiniteData<T[]>>;
  bulkableAction: (userId: string) => Promise<void>;
  onUpload?: (x: Promise<DriveFile>[]) => Promise<void>;
  actionName: string;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [hasStarted, setHasStarted] = useState(false);
  const { data, refetch, isRefetching } = query;

  async function runBulkAction() {
    setHasStarted(true);
    for (const userId of selected) {
      try {
        await bulkableAction(userId);
      } catch (e) {
        toast.error(errorMessageSafe(e));
      }
      setRemoved((prev) => new Set(prev).add(userId));
    }
    setHasStarted(false);
    setSelected(new Set());
    await refetch();
    setRemoved(new Set());
  }

  const bulkActionWithConfirm = useAfterConfirm(
    {
      title: t('areYouSure'),
      description: `Are you sure you want to [${actionName}] ${selected.size} users?`,
      confirmText: actionName,
      variant: 'destructive',
    },
    () => void runBulkAction(),
  );

  return (
    <div>
      <HeaderRightPortal>
        <Button variant="ghost" size="icon-sm" onClick={() => refetch()}>
          <RefreshCw className={cn(isRefetching && 'animate-spin')} />
        </Button>
      </HeaderRightPortal>

      {hasStarted && <Progress value={(removed.size / selected.size) * 100} className="mb-2" />}
      <div className="controls mb-2 flex items-center justify-between">
        <div>
          <span>Selected {selected.size} users</span>
        </div>
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => {
              setSelected(new Set(data?.pages.flat(2).map((item) => item.user.id)));
            }}
            disabled={hasStarted}
          >
            <CheckCheckIcon />
            {t('all')}
          </Button>

          <Button
            variant="destructive"
            onClick={() => bulkActionWithConfirm()}
            disabled={hasStarted || selected.size === 0}
          >
            <MinusIcon />
            {actionName}
          </Button>

          {onUpload && (
            <MkFileUploadMenu onUpload={onUpload} limit={1} disableCompress>
              <Button variant="outline">
                <UploadCloudIcon />
                {t('import')}
              </Button>
            </MkFileUploadMenu>
          )}
        </ButtonGroup>
      </div>

      <MkInfiniteScrollByData infiniteQueryResult={query} dataContainer={RelationInfinityLoaderTable}>
        {(relation) =>
          removed.has(relation.user.id) ? null : (
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selected.has(relation.user.id)}
                  disabled={hasStarted}
                  onCheckedChange={(checked) => {
                    if (checked && selected.has(relation.user.id)) {
                      return;
                    }
                    if (!checked && !selected.has(relation.user.id)) {
                      return;
                    }
                    const newSet = new Set(selected);
                    if (checked) {
                      newSet.add(relation.user.id);
                    } else {
                      newSet.delete(relation.user.id);
                    }
                    setSelected(newSet);
                  }}
                />
              </TableCell>
              <TableCell>
                <Icon item={relation} />
              </TableCell>
              <TableCell className="max-w-40 overflow-hidden">
                <MkMention username={relation.user.username} host={relation.user.host} />
              </TableCell>
              <TableCell>
                <MkUserName user={relation.user} />
              </TableCell>
              <TableCell>
                <MkTime time={relation.createdAt} colored={false} />
              </TableCell>
            </TableRow>
          )
        }
      </MkInfiniteScrollByData>
    </div>
  );
}
