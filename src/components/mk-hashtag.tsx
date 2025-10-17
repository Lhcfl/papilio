import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import type { HTMLAttributes } from 'react';

export const MkHashTag = ({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
} & HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      to="/tag/$tag"
      params={{ tag: name }}
      className={cn('break-all break-words text-tertiary hover:underline', className)}
      {...props}
    >
      #{name}
    </Link>
  );
};
