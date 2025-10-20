/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const MkClock = () => {
  const [time, setTime] = useState(() => new Date());
  const { t, i18n } = useTranslation();

  const dateTimeFormat = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  useEffect(() => {
    const tickId = setInterval(() => {
      setTime(new Date());
    }, 10000);
    return () => {
      clearInterval(tickId);
    };
  }, []);

  return (
    <div className="h-20 flex">
      <div className="left flex-1/2">{dateTimeFormat.format(time)}</div>
      <div className="right flex-1/2 flex flex-col text-sm">
        <div>{t('thisYear')}</div>
        <div>{t('thisMonth')}</div>
        <div>{t('today')}</div>
      </div>
    </div>
  );
};
