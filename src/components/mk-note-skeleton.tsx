import { Skeleton } from './ui/skeleton'

export const MkNoteSkeleton = () => {
  return (
    <div className="mk-note-skeleton p-2">
      <div className="note-header-skeleton p-2 flex gap-2 items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-grow-1">
          <Skeleton className="h-4 w-32 ml-2" />
          <Skeleton className="h-4 w-20 ml-2 mt-2" />
        </div>
        <div>
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="note-body-skeleton p-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-[50%]" />
      </div>
      <div className="note-actions-skeleton p-2 flex">
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
      </div>
    </div>
  )
}
