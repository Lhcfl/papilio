import { LoadingTrigger } from './loading-trigger';
import { MkNote } from './mk-note';
import { Spinner } from './ui/spinner';

export const MkTimeline = (props: { type: TimelineTypes }) => {
  const { data, isError, fetchNextPage, hasNextPage, isLoading } = useTimeline(props.type);

  return (
    <div className="mk-timerline w-full">
      {isError && <div>Error</div>}
      {data?.pages.flatMap((page) => page.map((id) => <MkNote key={id} noteId={id} />))}
      {(isLoading || hasNextPage) && (
        <div className="w-full flex justify-center my-4">
          <LoadingTrigger onShow={fetchNextPage}>
            <Spinner />
          </LoadingTrigger>
        </div>
      )}
    </div>
  );
};
