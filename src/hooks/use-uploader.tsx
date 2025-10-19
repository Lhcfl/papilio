/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCompressionConfig, mimeTypeToFileExtension } from '@/lib/upload';
import { getRelativeUrl, token } from '@/services/inject-misskey-api';
import { useMe } from '@/stores/me';
import { useSiteMeta } from '@/stores/site';
import { useUploadProgress } from '@/stores/upload-progress';
import {
  readAndCompressImage,
  type BrowserImageResizerConfigWithConvertedOutput,
} from '@misskey-dev/browser-image-resizer';
import type { DriveFile, DriveFolder } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export interface UploadFileOptions {
  keepOriginal?: boolean;
  name?: string;
  folder?: string | DriveFolder | null;
}

async function compress(
  id: string,
  file: File,
  fileName: string,
  config?: Partial<BrowserImageResizerConfigWithConvertedOutput>,
) {
  const extension = fileName.split('.').length > 1 ? `.${fileName.split('.').pop()}` : '';
  let uploadName = id + extension;
  if (config) {
    try {
      const resized = await readAndCompressImage(file, config);

      uploadName =
        file.type !== config.mimeType ? `${uploadName}.${mimeTypeToFileExtension(config.mimeType)}` : uploadName;

      // The compression may not always reduce the file size
      // (and WebP is not browser safe yet)
      if (resized.size < file.size || file.type === 'image/webp') {
        if (import.meta.env.DEV) {
          const saved = ((1 - resized.size / file.size) * 100).toFixed(2);
          console.log('[compress] original size:', file.size, '-> resized size:', resized.size, `saved ${saved}%`);
        }
        return [resized, uploadName] as const;
      }
    } catch (err) {
      console.error('Image compression failed:', err);
    }
  }
  return [file, uploadName] as const;
}

export function useUploader() {
  const { t } = useTranslation();
  const maxFileSize = useSiteMeta((s) => s.maxFileSize);
  const myMaxFileSizeMb = useMe((me) => me.policies.maxFileSizeMb) ?? 0;
  const add = useUploadProgress((s) => s.add);
  const setProgress = useUploadProgress((s) => s.setProgress);
  const remove = useUploadProgress((s) => s.remove);

  async function uploadFile(file: File, options?: UploadFileOptions): Promise<DriveFile> {
    const id = crypto.randomUUID();
    const folderId = typeof options?.folder == 'string' ? options.folder : options?.folder?.id;

    if (file.size > maxFileSize || file.size > myMaxFileSizeMb * 1024 * 1024) {
      throw new Error(t('cannotUploadBecauseExceedsFileSizeLimit'));
    }

    await file.arrayBuffer();

    const fileName = options?.name ?? (file.name || 'untitled');
    const compressConfig = options?.keepOriginal ? undefined : await getCompressionConfig(file);

    const [fileToUpload, name] = await compress(id, file, fileName, compressConfig);

    const formData = new FormData();

    // SAFE: non-null assertion because upload is not possible without user token
    formData.append('i', token!);
    formData.append('force', 'true');
    formData.append('file', fileToUpload);
    formData.append('name', name);
    if (folderId) formData.append('folderId', folderId);

    add({
      id,
      name,
      progressMax: undefined,
      progressValue: undefined,
      img: window.URL.createObjectURL(file),
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getRelativeUrl('/api/drive/files/create'), true);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(id, ev.loaded, ev.total);
      }
    };

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', function (ev) {
        if (xhr.status !== 200 || ev.target == null || this.response == null) {
          // TODO: 消すのではなくて(ネットワーク的なエラーなら)再送できるようにしたい
          remove(id);

          if (xhr.status === 413) {
            reject(new Error(t('cannotUploadBecauseExceedsFileSizeLimit')));
          } else if (this.response) {
            const safeParseResponse = () => {
              if (typeof this.response != 'string') {
                reject(new Error('Unknown error: Server returned invalid response'));
                throw new Error('Unknown error: Server returned invalid response');
              } else {
                try {
                  return JSON.parse(this.response) as { error?: { id: string; message: string; code: string } };
                } catch {
                  console.error('Failed to parse response:', this.response);
                  reject(new Error('Unknown error: Server returned invalid response'));
                  throw new Error('Unknown error: Server returned invalid response');
                }
              }
            };

            const res = safeParseResponse();
            if (res.error?.id === 'bec5bd69-fba3-43c9-b4fb-2894b66ad5d2') {
              reject(new Error(t('cannotUploadBecauseInappropriate')));
            } else if (res.error?.id === 'd08dbc37-a6a9-463a-8c47-96c32ab5f064') {
              reject(new Error(t('cannotUploadBecauseNoFreeSpace')));
            } else {
              reject(new Error(`${res.error?.message}\n${res.error?.code}\n${res.error?.id}`));
            }
          } else {
            reject(new Error(`Unknown error: ${JSON.stringify(this.response)}, ${JSON.stringify(xhr.response)}`));
          }
          return;
        }

        const driveFile = JSON.parse(this.response as string) as DriveFile;
        resolve(driveFile);
        remove(id);
      });

      xhr.send(formData);
    });
  }

  return uploadFile;
}
