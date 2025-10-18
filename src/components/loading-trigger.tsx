/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect, useRef } from 'react';

import type { HTMLProps } from 'react';

export const LoadingTrigger = (
  props: {
    onShow: () => void;
    children?: React.ReactNode;
  } & HTMLProps<HTMLDivElement>,
) => {
  const ref = useRef<HTMLDivElement>(null);
  const { onShow, children, ...divProps } = props;

  useEffect(() => {
    const observer = new IntersectionObserver((ent) => {
      if (ent[0].isIntersecting) {
        onShow();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onShow]);

  return (
    <div ref={ref} {...divProps}>
      {children}
    </div>
  );
};
