/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const MkClock = () => {
  const [time, setTime] = useState(() => new Date());
  const { i18n } = useTranslation();

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

  return <div>{dateTimeFormat.format(time)}</div>;
};
