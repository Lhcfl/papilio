// /**
//  * Update locale messages from upstream.
//  */
// import { writeFile } from 'fs/promises';

// // you can provide your github token
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
// const GITHUB_REPO = 'Lhcfl/sharkey-stelpolva';
// const BRANCH = 'stelpolva';
// const PROJECT_ROOT = new URL('..', import.meta.url);

// async function githubRequest(url: string) {
//   const res = await fetch(url, {
//     headers: {
//       Accept: 'application/vnd.github.v3+json',
//       Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
//     },
//   });
//   if (!res.ok) {
//     throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
//   }
//   return res.json();
// }

// async function listFiles(folder: string, override?: { repo: string; branch?: string }) {
//   const { repo: override_repo, branch: override_branch } = override ?? {};
//   const repo = override_repo ?? GITHUB_REPO;
//   const branch = override_branch ?? BRANCH;
//   const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`;
//   const data = await githubRequest(apiUrl);

//   return data as {
//     name: string;
//     path: string;
//     type: 'file' | 'dir';
//     download_url: string | null;
//   }[];
// }

// async function downloadFile(fileUrl: string, savePath: URL) {
//   console.log(`[INFO]: Downloading ${fileUrl}\n\t-> ${savePath}`);
//   const res = await fetch(fileUrl);
//   if (!res.ok) {
//     throw new Error(`[ERR]: ${fileUrl} - ${res.status} ${await res.text()}`);
//   }
//   const buf = Buffer.from(await res.arrayBuffer());
//   await writeFile(savePath, buf);
//   console.log(`Downloaded: ${savePath}`);
// }

// async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 5000): Promise<T> {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await fn();
//     } catch (error) {
//       if (i < retries - 1) {
//         console.error(`(${i + 1}/${retries}) [ERR]: ${error}`);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         throw error;
//       }
//     }
//   }
//   throw new Error('Unreachable');
// }

// const promises = ['locales', 'sharkey-locales', 'stpv-locales'].map(async (folderPath) => {
//   console.log(`[INFO]: Fetching ${folderPath}`);
//   const files = await listFiles(
//     folderPath,
//     folderPath === 'locales'
//       ? {
//           repo: 'misskey-dev/misskey',
//           branch: 'develop',
//         }
//       : undefined,
//   );
//   const yamls = files.filter((x) => x.name.endsWith('.yml') && x.type === 'file' && x.download_url);
//   return Promise.allSettled(
//     yamls.map(async (f) => {
//       const path = new URL(`locales-source/${folderPath}/${f.name}`, PROJECT_ROOT);
//       withRetry(() => downloadFile(f.download_url!, path));
//     }),
//   );
// });

// const res = await Promise.all(promises);
// const failed = res.flat().filter((x) => x.status === 'rejected');
// if (failed.length > 0) {
//   console.error(`${failed.length} files failed to download.`);
// }

import { StartDownloaderTui } from './tui/downloader';

// const promises = downloader({ 'packages/misskey-js/src': 'sharkey-js' });

// const res = await promises;
// const failed = res.flat().filter((x) => x.status === 'rejected');
// if (failed.length > 0) {
//   console.error(`${failed.length} files failed to download.`);
// }

StartDownloaderTui({
  locales: 'locales-source/locales',
  'sharkey-locales': 'locales-source/sharkey-locales',
  'stpv-locales': 'locales-source/stpv-locales',
});
