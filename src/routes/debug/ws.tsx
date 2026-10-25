/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* oxlint-disable typescript/no-unsafe-argument */
/* oxlint-disable typescript/no-unsafe-assignment */
/* oxlint-disable typescript/no-unsafe-member-access */
/* oxlint-disable typescript/no-unsafe-call */
/* oxlint-disable typescript/no-explicit-any */
import { MkCode } from '@/components/mk-code';
import { ScrollArea } from '@/ui/scroll-area';
import { site, token } from '@/lib/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { Stream } from 'misskey-js';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { AppThemeToggle } from '@/components/app-theme-toggle';

export const Route = createFileRoute('/debug/ws')({
  component: RouteComponent,
  staticData: {
    noAuth: true,
  },
});

function RouteComponent() {
  if (token === null || site === null) {
    return <div className="p-4">no token</div>;
  }
  return <WsDebugger site={site} token={token} />;
}

const AvailableChannels = [
  'drive',
  'main',
  'homeTimeline',
  'localTimeline',
  'hybridTimeline',
  'globalTimeline',
  'userList',
  'hashtag',
  'roleTimeline',
  'antenna',
  'channel',
  'serverStats',
  'queueStats',
  'admin',
  'reversi',
  'reversiGame',
  'chatUser',
  'chatRoom',
] as const;

function WsDebugger({ site, token }: { site: string; token: string }) {
  const misskeyStream = useMemo(() => new Stream(site, { token }), [site, token]);
  const wsStream = (misskeyStream as any).stream;

  const [messages, setMessages] = useState<{ time: Date; data: unknown }[]>(() => [
    { time: new Date(), data: { info: 'connected' } },
  ]);
  const [channels, setChannels] = useState<(typeof AvailableChannels)[number][]>([]);

  const handleMessage = useEffectEvent((msg: any) => {
    const data = JSON.parse(msg.data);
    setMessages((msgs) => [{ time: new Date(), data }, ...msgs]);
    console.log(data);
  });

  useEffect(() => {
    return () => {
      setMessages((msgs) => [{ time: new Date(), data: { info: 'connection closed' } }, ...msgs]);
      misskeyStream.close();
    };
  }, [misskeyStream]);

  useEffect(() => {
    const interval = setInterval(() => {
      misskeyStream.heartbeat();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [misskeyStream]);

  useEffect(() => {
    const fuckuse = 'USE'.toLowerCase();
    const c = channels.map((name) => {
      return misskeyStream[(fuckuse + 'Channel') as 'useChannel'](name);
    });
    console.log(misskeyStream);
    wsStream.addEventListener('message', handleMessage);
    return () => {
      wsStream.removeEventListener('message', handleMessage);
      c.forEach((conn) => {
        conn.dispose();
      });
    };
  }, [wsStream, channels, misskeyStream]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">
        WS Debugger <AppThemeToggle />
      </h1>
      <div className="grid grid-cols-[200px_1fr] gap-2">
        <div className="sticky top-0 h-fit border-r pt-4">
          {AvailableChannels.map((ch) => (
            <Label key={ch} className="mb-1">
              <Switch
                checked={channels.includes(ch)}
                onCheckedChange={(val) => {
                  if (val) {
                    setChannels((chs) => [...chs, ch]);
                  } else {
                    setChannels((chs) => chs.filter((c) => c !== ch));
                  }
                }}
              />
              {ch}
            </Label>
          ))}
        </div>
        <div>
          {messages.map((msg, i) => (
            // oxlint-disable-next-line react/no-array-index-key
            <div key={i} className="my-2 text-sm">
              <div>
                {msg.time.toLocaleDateString()} {msg.time.toLocaleTimeString()}
              </div>
              <ScrollArea className="flex max-h-100 flex-col rounded-md">
                <MkCode className="text-sm!" language="json" code={JSON.stringify(msg.data, null, 2)} />
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
