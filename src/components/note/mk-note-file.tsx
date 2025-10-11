import clsx from 'clsx'
import { CodeXmlIcon, FileArchiveIcon, FileIcon, FileMusicIcon, FileTextIcon } from 'lucide-react'
import type { DriveFile } from 'misskey-js/entities.js'
import type { HTMLProps } from 'react'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item'

const guessFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case '7z':
    case 'rar':
    case 'tar':
    case 'gz':
    case 'zip':
      return <FileArchiveIcon />
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
      return <CodeXmlIcon />
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'txt':
      return <FileTextIcon />
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'm4a':
      return <FileMusicIcon />

    default:
      return <FileIcon />
  }
}

export const MkNoteFile = (props: { file: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { file, className: classNameProps, ...rest } = props

  const className = clsx('p-2', classNameProps)

  return (
    <Item className={className} {...rest} size="sm" variant="muted" asChild>
      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <ItemMedia variant="icon">
          {guessFileIcon(file.name)}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{file.name}</ItemTitle>
          <ItemDescription className="text-xs">{file.comment}</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  )
}
