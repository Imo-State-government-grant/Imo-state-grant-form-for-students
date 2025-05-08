
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { GrantFormData } from "@/hooks/useGrantForm";
import PaystackPaymentHandler from './PaystackPaymentHandler';

interface PaymentFormProps {
  formData: GrantFormData;
  onPaymentComplete: () => void;
  onClose: () => void;
  scriptLoaded: boolean;
  scriptError: boolean;
}

const PaymentForm = ({ 
  formData, 
  onPaymentComplete, 
  onClose, 
  scriptLoaded, 
  scriptError 
}: PaymentFormProps) => {
  return (
    <div className="space-y-4 pt-4">
      {scriptError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Payment Service Error</AlertTitle>
          <AlertDescription>
            We're having trouble connecting to our payment provider. 
            Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label htmlFor="cardName" className="text-sm font-medium">
          Cardholder Name
        </label>
        <Input 
          id="cardName" 
          placeholder="Name on card" 
          required 
          defaultValue={formData.fullName}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="cardEmail" className="text-sm font-medium">
          Email Address
        </label>
        <Input 
          id="cardEmail" 
          type="email"
          placeholder="Email address" 
          required 
          defaultValue={formData.email}
          readOnly
        />
      </div>
      
      <PaystackPaymentHandler
        formData={formData}
        onSuccess={onPaymentComplete}
        onCancel={onClose}
        scriptLoaded={scriptLoaded}
        scriptError={scriptError}
      />
      
      <div className="flex justify-center mt-2">
        <img 
          src="https://assets.paystack.com/assets/img/logos/powered-by-paystack.svg" 
          alt="Powered by Paystack" 
          className="h-8" 
        />
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-2">
        Your payment information is secure. Transaction ID: {`grant-${Date.now().toString().slice(-6)}`}
      </p>
    </div>
  );
};

export default PaymentForm;
