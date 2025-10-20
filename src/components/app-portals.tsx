import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMount } from 'react-use';

export const PORTALABLE_HEADER_LEFT_CLASSNAME = 'ptrb-header__left';
export const PORTALABLE_HEADER_RIGHT_CLASSNAME = 'ptrb-header__right';

export function ContextualHeaderLeftPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useMount(() => {
    const elems = document.getElementsByClassName(PORTALABLE_HEADER_LEFT_CLASSNAME) as HTMLCollectionOf<HTMLElement>;
    let rankMax = -1;
    let targetElem: HTMLElement | null = null;
    for (const elem of elems) {
      const rank = Number(elem.dataset.ptrbRank ?? 0);
      if (rank > rankMax) {
        rankMax = rank;
        targetElem = elem;
      }
    }
    if (targetElem) {
      setContainer(targetElem);
    }
  });
  if (!container) return null;
  else return createPortal(props.children, container);
}

export function ContextualHeaderRightPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useMount(() => {
    const elems = document.getElementsByClassName(PORTALABLE_HEADER_RIGHT_CLASSNAME) as HTMLCollectionOf<HTMLElement>;
    let rankMax = -1;
    let targetElem: HTMLElement | null = null;
    for (const elem of elems) {
      const rank = Number(elem.dataset.ptrbRank ?? 0);
      if (rank > rankMax) {
        rankMax = rank;
        targetElem = elem;
      }
    }
    if (targetElem) {
      setContainer(targetElem);
    }
  });
  if (!container) return null;
  else return createPortal(props.children, container);
}
