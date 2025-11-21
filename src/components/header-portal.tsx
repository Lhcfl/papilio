/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getHeaderCenterId, getHeaderLeftId, getHeaderRightId, WindowContext } from '@/providers/window-provider';
import { use, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function HeaderRightPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { headerId } = use(WindowContext);
  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    setContainer(document.getElementById(getHeaderRightId(headerId)));
  }, [headerId]);
  if (!container) return null;
  else return createPortal(props.children, container);
}

export function HeaderLeftPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { headerId } = use(WindowContext);
  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    setContainer(document.getElementById(getHeaderLeftId(headerId)));
  }, [headerId]);
  if (!container) return null;
  else return createPortal(props.children, container);
}

export function HeaderCenterPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { headerId } = use(WindowContext);

  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContainer(document.getElementById(getHeaderCenterId(headerId)));

    const headerLeft = document.getElementById(getHeaderLeftId(headerId));
    if (headerLeft) {
      headerLeft.dataset.centerCount = (Number(headerLeft.dataset.centerCount ?? '0') + 1).toString();
    }
    return () => {
      const headerLeft = document.getElementById(getHeaderLeftId(headerId));
      if (headerLeft) {
        headerLeft.dataset.centerCount = (Number(headerLeft.dataset.centerCount ?? '0') - 1).toString();
        if (Number(headerLeft.dataset.centerCount) <= 0) {
          delete headerLeft.dataset.centerCount;
        }
      }
    };
  }, [headerId]);
  if (!container) return null;
  else return createPortal(props.children, container);
}
