import clsx from 'clsx';
import {
  CodeXmlIcon,
  FileArchiveIcon,
  FileIcon,
  FileImageIcon,
  FileMusicIcon,
  FileTextIcon,
  FileVideo2Icon,
} from 'lucide-react';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item';

export const GuessFileIcon = (props: { file: DriveFile }) => {
  const { file } = props;
  if (file.type.startsWith('image/')) return <FileImageIcon />;
  if (file.type.startsWith('video/')) return <FileVideo2Icon />;
  if (file.type.startsWith('audio/')) return <FileMusicIcon />;
  if (file.type.startsWith('text/')) return <FileTextIcon />;
  if (file.type.endsWith('/pdf')) return <FileTextIcon />;
  if (
    [
      'application/zip',
      'application/x-cpio',
      'application/x-bzip',
      'application/x-bzip2',
      'application/java-archive',
      'application/x-rar-compressed',
      'application/x-tar',
      'application/gzip',
      'application/x-7z-compressed',
    ].some((archiveType) => archiveType === file.type)
  )
    return <FileArchiveIcon />;

  // Fallback to extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case '7z':
    case 'rar':
    case 'tar':
    case 'gz':
    case 'zip':
      return <FileArchiveIcon />;
    case 'cpp':
    case 'c':
    case 'cs':
    case 'css':
    case 'go':
    case 'html':
    case 'java':
    case 'js':
    case 'json':
    case 'jsx':
    case 'md':
    case 'php':
    case 'py':
    case 'rs':
    case 'ts':
    case 'tsx':
    case 'xml':
    case 'yml':
    case 'yaml':
      return <CodeXmlIcon />;
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'txt':
      return <FileTextIcon />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'm4a':
      return <FileMusicIcon />;

    default:
      return <FileIcon />;
  }
};

export const MkNoteFile = (props: { file: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { file, className: classNameProps, ...rest } = props;

  const className = clsx('p-2', classNameProps);

  return (
    <Item className={className} {...rest} size="sm" variant="muted" asChild>
      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <ItemMedia variant="icon">
          <GuessFileIcon file={file} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{file.name}</ItemTitle>
          <ItemDescription className="text-xs">{file.comment}</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  );
};
