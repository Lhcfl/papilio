/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { mkdir, writeFile } from 'fs/promises';
import { render, Text } from 'ink';
import { createContext, use } from 'react';

// you can provide your github token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const GITHUB_REPO = 'Lhcfl/sharkey-stelpolva';
const BRANCH = 'stelpolva';
const PROJECT_ROOT = new URL('../..', import.meta.url);

const queryClient = new QueryClient();

const FileContext = createContext<{ prepend?: string }>({});

const Prepare = () => (
  <>
    <Text>GITHUB_TOKEN: {GITHUB_TOKEN}</Text>
    <Text>GITHUB_REPO: {GITHUB_REPO}</Text>
    <Text>BRANCH: {BRANCH}</Text>
    <Text>PROJECT_ROOT: {PROJECT_ROOT.toString()}</Text>
  </>
);

async function githubRequest(url: string) {
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

const parseFolder = (folder: string) => {
  if (folder.includes(':')) {
    const [fullRepo, path] = folder.split(':', 2);
    const [owner, repo, branch] = fullRepo.split('/');
    return { repo: `${owner}/${repo}`, branch, path };
  }
  return { repo: GITHUB_REPO, branch: BRANCH, path: folder };
};

async function listFiles(folder: string) {
  const { repo, branch, path } = parseFolder(folder);
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const data = await githubRequest(apiUrl);

  return data as {
    name: string;
    path: string;
    type: 'file' | 'dir';
    download_url: string | null;
  }[];
}

const FileDownloader = (props: { url: string; to: string; filename: string }) => {
  const downloadDir = new URL(props.to + '/', PROJECT_ROOT);
  const fileUrl = new URL(props.filename, downloadDir);
  const fileContext = use(FileContext);

  const { data, isLoading, error } = useQuery({
    queryKey: ['download', props.url, props.to, props.filename],
    queryFn: async () => {
      const res = await fetch(props.url);
      if (!res.ok) {
        throw new Error(`${props.url} - ${res.status} ${await res.text()}`);
      }
      let buf = Buffer.from(await res.arrayBuffer());
      await mkdir(downloadDir, { recursive: true });
      if (fileContext.prepend) {
        buf = Buffer.concat([Buffer.from(fileContext.prepend), buf]);
      }
      await writeFile(fileUrl, buf);
      return true;
    },
  });

  return (
    <>
      {isLoading && (
        <Text color="yellow">
          [...] Downloading {props.url} {'->'} {fileUrl.toString()}
        </Text>
      )}
      {error && <Text color="red">[ERR]: {error.message}</Text>}
      {data && (
        <Text color="green">
          [OK] {props.url} {'->'} {fileUrl.toString()}
        </Text>
      )}
    </>
  );
};

const FolderDownloader = (props: { from: string; to: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['listFiles', props.from, props.to],
    queryFn: () => listFiles(props.from),
  });

  return (
    <>
      {isLoading && <Text color="yellow">Loading {props.from}...</Text>}
      {error && <Text color="red">Error: {error.message}</Text>}
      {data && (
        <Text color="green">
          Found {data.length} files in {props.from}
        </Text>
      )}
      {data?.map(
        (file) =>
          file.type === 'file' &&
          file.download_url && (
            <FileDownloader key={file.download_url} url={file.download_url} to={props.to} filename={file.name} />
          ),
      )}
      {data?.map(
        (file) =>
          file.type === 'dir' && (
            <FolderDownloader key={file.path} from={props.from + '/' + file.name} to={props.to + '/' + file.name} />
          ),
      )}
    </>
  );
};

const MultiDownloader = (props: { downloads: Record<string, string> }) => {
  return Object.entries(props.downloads).map(([from, to]) => (
    <FolderDownloader key={`${from}->${to}`} from={from} to={to} />
  ));
};

export const StartDownloaderTui = (downloads: Record<string, string>, opts?: { prepend?: string }) => {
  render(
    <QueryClientProvider client={queryClient}>
      <FileContext value={{ prepend: opts?.prepend }}>
        <Prepare />
        <MultiDownloader downloads={downloads} />
      </FileContext>
    </QueryClientProvider>,
  );
};
