import { useState, useEffect } from 'react';

import clsx from 'clsx';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

function getDateSafe(n: Date | string | number) {
  try {
    if (n instanceof Date) {
      return n;
    }
    return new Date(n);
  } catch {
    return {
      getTime: () => NaN,
    };
  }
}

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

export const MkTime = (
  props: {
    time: Date | string | number | null;
    origin?: Date | null;
    mode?: 'relative' | 'absolute' | 'detail';
    colored?: boolean;
    prepend?: React.ReactNode;
    append?: React.ReactNode;
  } & HTMLProps<HTMLTimeElement>,
) => {
  const { time, origin = null, mode = 'relative', colored = true, prepend, append, className, ...rest } = props;
  const { t } = useTranslation();

  const [realNow, setNow] = useState(Date.now());
  const datetime = time == null ? NaN : getDateSafe(time).getTime();
  const invalid = isNaN(datetime);
  const absolute = invalid ? t('nothing') : dateTimeFormat.format(datetime);
  const now = origin?.getTime() ?? realNow;
  const ago = (now - datetime) / 1000;

  useEffect(() => {
    const nextInterval = ago < 60 ? 10000 : ago < 3600 ? 60000 : 180000;
    const id = setTimeout(() => setNow(Date.now()), nextInterval);
    return () => clearTimeout(id);
  }, [ago, realNow]);

  const relative =
    mode === 'absolute'
      ? ''
      : invalid
        ? t('nothing')
        : ago >= 31536000
          ? t('_ago.yearsAgo', { n: Math.round(ago / 31536000).toString() })
          : ago >= 2592000
            ? t('_ago.monthsAgo', { n: Math.round(ago / 2592000).toString() })
            : ago >= 604800
              ? t('_ago.weeksAgo', { n: Math.round(ago / 604800).toString() })
              : ago >= 86400
                ? t('_ago.daysAgo', { n: Math.round(ago / 86400).toString() })
                : ago >= 3600
                  ? t('_ago.hoursAgo', { n: Math.round(ago / 3600).toString() })
                  : ago >= 60
                    ? t('_ago.minutesAgo', { n: (~~(ago / 60)).toString() })
                    : ago >= 10
                      ? t('_ago.secondsAgo', { n: (~~(ago % 60)).toString() })
                      : ago >= -3
                        ? t('_ago.justNow')
                        : ago < -31536000
                          ? t('_timeIn.years', {
                              n: Math.round(-ago / 31536000).toString(),
                            })
                          : ago < -2592000
                            ? t('_timeIn.months', {
                                n: Math.round(-ago / 2592000).toString(),
                              })
                            : ago < -604800
                              ? t('_timeIn.weeks', {
                                  n: Math.round(-ago / 604800).toString(),
                                })
                              : ago < -86400
                                ? t('_timeIn.days', {
                                    n: Math.round(-ago / 86400).toString(),
                                  })
                                : ago < -3600
                                  ? t('_timeIn.hours', {
                                      n: Math.round(-ago / 3600).toString(),
                                    })
                                  : ago < -60
                                    ? t('_timeIn.minutes', {
                                        n: (~~(-ago / 60)).toString(),
                                      })
                                    : t('_timeIn.seconds', {
                                        n: (~~(-ago % 60)).toString(),
                                      });

  const old = ago >= 60 * 60 * 24 * 90;
  const veryOld = ago > 60 * 60 * 24 * 180;

  return (
    <time
      title={absolute}
      className={clsx('mk-time flex items-center gap-1', className, {
        'text-yellow-500': colored && old && !veryOld,
        'text-red-500': colored && veryOld,
      })}
      {...rest}
    >
      {prepend}
      {invalid && t('nothing')}
      {mode === 'absolute' && absolute}
      {mode === 'relative' && relative}
      {mode === 'detail' && (
        <>
          {' '}
          {absolute} ({relative}){' '}
        </>
      )}
      {append}
    </time>
  );
};
