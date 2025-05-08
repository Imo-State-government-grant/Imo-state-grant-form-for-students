
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { GrantFormData } from "@/hooks/useGrantForm";
import PaystackScriptLoader from './PaystackScriptLoader';
import PaymentForm from './PaymentForm';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  formData: GrantFormData;
}

const PaymentModal = ({ open, onClose, onPaymentComplete, formData }: PaymentModalProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  
  const handleScriptLoaded = () => {
    setScriptLoaded(true);
    setScriptError(false);
  };
  
  const handleScriptError = () => {
    setScriptError(true);
    setScriptLoaded(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Pay with Paystack</DialogTitle>
          <DialogDescription>
            Application fee: ₦2,000
          </DialogDescription>
        </DialogHeader>
        
        {open && (
          <PaystackScriptLoader 
            onScriptLoaded={handleScriptLoaded}
            onScriptError={handleScriptError} 
          />
        )}
        
        <PaymentForm 
          formData={formData}
          onPaymentComplete={onPaymentComplete}
          onClose={onClose}
          scriptLoaded={scriptLoaded}
          scriptError={scriptError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
