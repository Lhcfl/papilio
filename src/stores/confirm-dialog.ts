import { create } from 'zustand';

export type DialogConfig = {
  title: string;
  description: string;
  confirmText?: string;
  confirmIcon?: React.ReactNode;
  cancelText?: string;
  cancelIcon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

type ConfirmDialogState = {
  dialogsQueue: (DialogConfig & { uuid: string })[];
  pushDialog: (config: DialogConfig) => void;
  popDialog: () => void;
};

export const useConfirmDialog = create<ConfirmDialogState>((set) => ({
  dialogsQueue: [],
  pushDialog: (config: DialogConfig) =>
    set((state) => ({
      dialogsQueue: [...state.dialogsQueue, { ...config, uuid: crypto.randomUUID() }],
    })),
  popDialog: () =>
    set((state) => ({
      dialogsQueue: state.dialogsQueue.slice(1),
    })),
}));

export const useAfterConfirm = (
  dialog: Omit<DialogConfig, 'onConfirm' | 'onCancel'>,
  onConfirm: () => unknown | Promise<unknown>,
  onCancel?: () => unknown,
) => {
  const pushDialog = useConfirmDialog((s) => s.pushDialog);

  return () =>
    new Promise((resolve) => {
      pushDialog({
        ...dialog,
        onConfirm: () => Promise.resolve(onConfirm()).then(() => resolve(true)),
        onCancel: () => Promise.resolve(onCancel?.()).then(() => resolve(false)),
      });
    });
};
