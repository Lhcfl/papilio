/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MkCode } from '@/components/mk-code';
import { ScrollArea } from '@/components/ui/scroll-area';
import { site, token } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { Stream } from 'misskey-js';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

  const [messages, setMessages] = useState<{ time: Date; data: unknown }[]>([]);
  const [channels, setChannels] = useState<(typeof AvailableChannels)[number][]>([]);

  const handleMessage = useEffectEvent((msg: any) => {
    const data = JSON.parse(msg.data);
    setMessages((msgs) => [{ time: new Date(), data }, ...msgs]);
    console.log(data);
  });

  useEffect(() => {
    handleMessage({ data: JSON.stringify({ info: 'connected' }) });
    return () => {
      handleMessage({ data: JSON.stringify({ info: 'connection closed' }) });
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
            // eslint-disable-next-line react-x/no-array-index-key
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
