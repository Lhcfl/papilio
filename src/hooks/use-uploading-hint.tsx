import { UploadingToast } from '@/components/uploading-toast';
import { useOnStartUpload } from '@/stores/upload-progress';
import { toast } from 'sonner';

export function useUploadingHint() {
  useOnStartUpload((uploading) => {
    toast.promise(uploading.promise, {
      loading: <UploadingToast img={uploading.img} id={uploading.id} />,
      success: (file) => file.name,
    });
  });
}
