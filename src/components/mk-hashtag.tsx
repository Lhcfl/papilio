import type { HTMLAttributes } from 'react';

export const MkHashTag = (
  props: {
    name: string;
    navigationBehavior?: unknown;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  return (
    <a href={`/tag/${props.name}`} {...props} className="break-all break-words text-tertiary hover:underline">
      #{props.name}
    </a>
  );
};
