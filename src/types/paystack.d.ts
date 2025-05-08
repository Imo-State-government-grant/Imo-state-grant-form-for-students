
interface PaystackPopInterface {
  newTransaction: (options: {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    firstname?: string;
    lastname?: string;
    onSuccess: (response: any) => void;
    onCancel: () => void;
    onClose: () => void;
    callback?: (response: any) => void;
    metadata?: Record<string, any>;
    [key: string]: any;
  }) => void;
}

interface Window {
  PaystackPop: {
    new (): PaystackPopInterface;
  };
}
