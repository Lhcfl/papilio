import { MkNotifications } from './mk-notifications';
import { MkClock } from './note/mk-clock';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export const AppRightCard = () => {
  return (
    <ScrollArea className="w-80 xl:w-90 h-screen p-2">
      <MkClock />
      <Separator />
      <ScrollArea className="h-100">
        <MkNotifications />
      </ScrollArea>
    </ScrollArea>
  );
};
