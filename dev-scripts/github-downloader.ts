/**
 * Update shareky-js
 */
import { writeFile, mkdir } from 'fs/promises';

// you can provide your github token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const GITHUB_REPO = 'Lhcfl/sharkey-stelpolva';
const BRANCH = 'stelpolva';
const PROJECT_ROOT = new URL('..', import.meta.url);

export async function githubRequest(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function listFiles(folder: string, override?: { repo: string; branch?: string }) {
  const { repo: override_repo, branch: override_branch } = override ?? {};
  const repo = override_repo ?? GITHUB_REPO;
  const branch = override_branch ?? BRANCH;
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`;
  const data = await githubRequest(apiUrl);

  return data as {
    name: string;
    path: string;
    type: 'file' | 'dir';
    download_url: string | null;
  }[];
}

export async function downloadFile(fileUrl: string, savePath: URL, fileName: string) {
  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`${fileUrl} - ${res.status} ${await res.text()}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(savePath, { recursive: true });
  const filePath = new URL(fileName, savePath);
  await writeFile(filePath, buf);
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 5000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries - 1) {
        console.error(`(${i + 1}/${retries}) [ERR]: ${error}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Unreachable');
}

const singleDownloader = async (from: string, to: string): Promise<PromiseSettledResult<void>[]> => {
  console.log(`[INFO]: Fetching ${from}`);
  const items = await listFiles(from);
  const files = items.filter((x) => x.type === 'file' && x.download_url);
  const folders = items.filter((x) => x.type === 'dir');
  const rec = Promise.all(folders.map((f) => singleDownloader(from + '/' + f.name, to + '/' + f.name)));
  return [
    ...(await Promise.allSettled(
      files.map(async (f) => {
        const path = new URL(to + '/', PROJECT_ROOT);
        withRetry(() => downloadFile(f.download_url!, path, f.name));
      }),
    )),
    ...(await rec).flat(),
  ];
};

export const downloader = async (pathMap: Record<string, string>) => {
  return (await Promise.all(Object.entries(pathMap).flatMap(([from, to]) => singleDownloader(from, to)))).flat();
};
