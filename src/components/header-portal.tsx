/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getHeaderCenterId, getHeaderLeftId, getHeaderRightId, WindowContext } from '@/providers/window-provider';
import { use, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function HeaderRightPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const HEADER_RIGHT_PORTAL_ID = getHeaderRightId(use(WindowContext).headerId);
  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    setContainer(document.getElementById(HEADER_RIGHT_PORTAL_ID));
  }, [HEADER_RIGHT_PORTAL_ID]);
  if (!container) return null;
  else return createPortal(props.children, container);
}

export function HeaderLeftPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const HEADER_LEFT_PORTAL_ID = getHeaderLeftId(use(WindowContext).headerId);
  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    setContainer(document.getElementById(HEADER_LEFT_PORTAL_ID));
  }, [HEADER_LEFT_PORTAL_ID]);
  if (!container) return null;
  else return createPortal(props.children, container);
}

export function HeaderCenterPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const HEADER_CENTER_PORTAL_ID = getHeaderCenterId(use(WindowContext).headerId);
  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    setContainer(document.getElementById(HEADER_CENTER_PORTAL_ID));
  }, [HEADER_CENTER_PORTAL_ID]);
  if (!container) return null;
  else return createPortal(props.children, container);
}
