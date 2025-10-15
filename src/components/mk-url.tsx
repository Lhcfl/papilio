import { LinkIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export const MkUrl = (
  props: {
    url: string;
    navigationBehavior?: unknown;
    children?: React.ReactNode;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  return (
    <a href={props.url} {...props} className="break-all break-words text-tertiary hover:underline">
      <LinkIcon className="size-4 inline mr-1 align-[-0.13em]" />
      {props.children ?? props.url}
    </a>
  );
};
