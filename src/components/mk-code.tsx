import { ScrollArea } from './ui/scroll-area';

export function MkCode(props: { code: string; language?: string | null }) {
  return (
    <div className="relative border rounded-md bg-accent">
      <span className="lang-tag absolute right-0 top-0 p-2 text-muted-foreground font-mono">{props.language}</span>
      <ScrollArea orientation="horizontal" className="flex md:p-4 overflow-x-auto">
        <pre className="flex-[1_1_auto] w-0">
          <code className={props.language ? `language-${props.language}` : undefined}>{props.code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
