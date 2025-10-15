import { LinkIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export const MkUrl = (
  props: {
    url: string;
    navigationBehavior?: unknown;
    children?: React.ReactNode;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  const { url, navigationBehavior, children, ...rest } = props;

  // TODO
  void navigationBehavior;

  return (
    <a href={url} rel="noopener noreferrer" {...rest} className="break-all break-words text-tertiary hover:underline">
      <LinkIcon className="size-4 inline mr-1 align-[-0.13em]" />
      {children ?? url}
    </a>
  );
};
