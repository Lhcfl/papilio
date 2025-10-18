/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { mkdir, writeFile } from 'fs/promises';
import { render, Text } from 'ink';

// you can provide your github token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const GITHUB_REPO = 'Lhcfl/sharkey-stelpolva';
const BRANCH = 'stelpolva';
const PROJECT_ROOT = new URL('../..', import.meta.url);

const queryClient = new QueryClient();

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

async function listFiles(folder: string, override?: { repo: string; branch?: string }) {
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

const FileDownloader = (props: { url: string; to: string; filename: string }) => {
  const downloadDir = new URL(props.to + '/', PROJECT_ROOT);
  const fileUrl = new URL(props.filename, downloadDir);

  const { data, isLoading, error } = useQuery({
    queryKey: ['download', props.url, props.to, props.filename],
    queryFn: async () => {
      const res = await fetch(props.url);
      if (!res.ok) {
        throw new Error(`${props.url} - ${res.status} ${await res.text()}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(downloadDir, { recursive: true });
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

export const StartDownloaderTui = (downloads: Record<string, string>) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Prepare />
      <MultiDownloader downloads={downloads} />
    </QueryClientProvider>,
  );
};
