export type Tab<T extends string = string> = {
  value: T;
  comp?: React.ReactNode;
  headerRight?: React.ReactNode;
} & (
  | {
      label: string;
      icon?: React.ReactNode;
    }
  | {
      label?: string;
      icon: React.ReactNode;
    }
);
