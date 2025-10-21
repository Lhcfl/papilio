import { Progress } from '@/components/ui/progress';
import { useUploadProgressOfId } from '@/stores/upload-progress';

export function UploadingToast(props: { img: string; id: string }) {
  const [value, max] = useUploadProgressOfId(props.id);

  return (
    <div className="flex w-70 gap-2">
      <img src={props.img} alt="" className="w-10 h-10 rounded-md object-cover" />
      <div className="flex-col w-full">
        <div className="text-sm mb-2">{Math.round((value / max) * 100)}%</div>
        <Progress className="w-full" value={(value / max) * 100} />
      </div>
    </div>
  );
}
