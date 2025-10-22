/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Progress } from '@/components/ui/progress';
import { useUploadProgressOfId } from '@/stores/upload-progress';

export function UploadingToast(props: { img: string; id: string }) {
  const [value, max] = useUploadProgressOfId(props.id);

  return (
    <div className="flex w-70 gap-2">
      <img src={props.img} alt="" className="h-10 w-10 rounded-md object-cover" />
      <div className="w-full flex-col">
        <div className="mb-2 text-sm">{Math.round((value / max) * 100)}%</div>
        <Progress className="w-full" value={(value / max) * 100} />
      </div>
    </div>
  );
}
