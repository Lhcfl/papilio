import { HEADER_LEFT_PORTAL_ID, HEADER_RIGHT_PORTAL_ID } from '@/layouts/default-layout';
import { RIGHTBAR_OR_POPUP_HEADERLEFT, RIGHTBAR_OR_POPUP_HEADERRIGHT } from '@/providers/rightbar-or-popup';
import { useRightbarOrPopup } from '@/stores/rightbar-or-poup';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMount } from 'react-use';

export function ContextualHeaderLeftPortal(props: { children: React.ReactNode }) {
  const hasRightBar = useRightbarOrPopup((s) => s.node != null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useMount(() => {
    if (hasRightBar) {
      const elem = document.getElementById(RIGHTBAR_OR_POPUP_HEADERLEFT);
      if (elem) {
        setContainer(elem);
      }
      return;
    }
    const elem = document.getElementById(HEADER_LEFT_PORTAL_ID);
    if (elem) {
      setContainer(elem);
      return;
    }
  });
  if (!container) return null;
  else return createPortal(props.children, container);
}

export function ContextualHeaderRightPortal(props: { children: React.ReactNode }) {
  const hasRightBar = useRightbarOrPopup((s) => s.node != null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useMount(() => {
    if (hasRightBar) {
      const elem = document.getElementById(RIGHTBAR_OR_POPUP_HEADERRIGHT);
      if (elem) {
        setContainer(elem);
      }
      return;
    }
    const elem = document.getElementById(HEADER_RIGHT_PORTAL_ID);
    if (elem) {
      setContainer(elem);
      return;
    }
  });
  if (!container) return null;
  else return createPortal(props.children, container);
}
