
export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export type ToastFunction = (props: ToastProps) => void;
