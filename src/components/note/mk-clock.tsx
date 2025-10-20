/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const MkClock = () => {
  const [time, setTime] = useState(() => new Date());
  const { t, i18n } = useTranslation();

  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const timeFormat = new Intl.DateTimeFormat(i18n.language, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  useEffect(() => {
    const tickId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(tickId);
    };
  }, []);

  const startOfThisYear = new Date(time.getFullYear(), 0, 0, 0, 0, 0).getTime();
  const startOfThisMonth = new Date(time.getFullYear(), time.getMonth(), 0, 0, 0, 0).getTime();
  const startOfToday = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, 0, 0).getTime();
  const endOfThisYear = new Date(time.getFullYear() + 1, 0, 0, 0, 0, 0).getTime();
  const endOfThisMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0, 0, 0, 0).getTime();
  const endOfToday = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1, 0, 0, 0).getTime();

  const yearProgress = (time.getTime() - startOfThisYear) / (endOfThisYear - startOfThisYear);
  const monthProgress = (time.getTime() - startOfThisMonth) / (endOfThisMonth - startOfThisMonth);
  const dayProgress = (time.getTime() - startOfToday) / (endOfToday - startOfToday);

  const weekDayI18n = [
    t('_weekday.monday'),
    t('_weekday.tuesday'),
    t('_weekday.wednesday'),
    t('_weekday.thursday'),
    t('_weekday.friday'),
    t('_weekday.saturday'),
    t('_weekday.sunday'),
  ][time.getDay() - 1];

  return (
    <div className="flex py-2">
      <div className="left flex-1/2 flex flex-col text-center">
        <div className="text-sm">{dateFormat.format(time)}</div>
        <div className="text-3xl flex-grow-1 flex items-center justify-center">{timeFormat.format(time)}</div>
        <div className="text-sm">{weekDayI18n}</div>
      </div>
      <div className="right flex-1/2 flex flex-col text-xs gap-2">
        <div>
          <div className="flex justify-between">
            <span>{t('thisYear')}</span>
            <span>{Math.floor(yearProgress * 100)}%</span>
          </div>
          <Progress value={yearProgress * 100} className='[&>[data-slot="progress-indicator"]]:bg-indigo-400!' />
        </div>
        <div>
          <div className="flex justify-between">
            <span>{t('thisMonth')}</span>
            <span>{Math.floor(monthProgress * 100)}%</span>
          </div>
          <Progress value={monthProgress * 100} className='[&>[data-slot="progress-indicator"]]:bg-green-500!' />
        </div>
        <div>
          <div className="flex justify-between">
            <span>{t('today')}</span>
            <span>{Math.floor(dayProgress * 100)}%</span>
          </div>
          <Progress value={dayProgress * 100} className='[&>[data-slot="progress-indicator"]]:bg-orange-500!' />
        </div>
      </div>
    </div>
  );
};
