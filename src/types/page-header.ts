export type Tab<T extends string = string> = {
  value: T;
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
