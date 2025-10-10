import { LoadingTrigger } from './loading-trigger'
import { MkNote } from './mk-note'
import { Spinner } from './ui/spinner'

export const MkTimeline = (props: { type: TimelineTypes }) => {
  const singleton = useNoteSingleton()
  const { data, isError, fetchNextPage, hasNextPage, isLoading } = useTimeline(props.type)

  const notes = data?.pages.flatMap(page => page.map(id => singleton.notes[id])) || []

  return (
    <div className="mk-timerline w-full">
      {isError && <div>Error</div>}
      {notes.map(note => note
        ? <MkNote key={note.id} note={note} />
        : <div>deleted</div>,
      )}
      {(isLoading || hasNextPage) && (
        <div className="w-full flex justify-center my-4">
          <LoadingTrigger onShow={fetchNextPage}>
            <Spinner />
          </LoadingTrigger>
        </div>
      )}
    </div>
  )
}
