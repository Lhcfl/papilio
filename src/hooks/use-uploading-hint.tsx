/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { UploadingToast } from '@/components/uploading-toast';
import { useOnStartUpload } from '@/stores/upload-progress';
import { toast } from 'sonner';

export function useUploadingHint() {
  useOnStartUpload((uploading) => {
    toast.promise(uploading.promise, {
      loading: <UploadingToast img={uploading.img} id={uploading.id} />,
      success: (file) => file.name,
    });
  });
}
