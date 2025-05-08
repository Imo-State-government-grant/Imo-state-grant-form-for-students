
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { GrantFormData } from "@/hooks/useGrantForm";
import PaystackPaymentHandler from './PaystackPaymentHandler';
import { AlertCircle, CheckCircle } from "lucide-react";

interface PaymentFormProps {
  formData: GrantFormData;
  onPaymentComplete: () => void;
  onClose: () => void;
  scriptLoaded: boolean;
  scriptError: boolean;
  onPaymentInitiate?: () => void;
  paymentInitiated?: boolean;
}

const PaymentForm = ({ 
  formData, 
  onPaymentComplete, 
  onClose, 
  scriptLoaded, 
  scriptError,
  onPaymentInitiate,
  paymentInitiated
}: PaymentFormProps) => {
  const [paymentAttempts, setPaymentAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const handlePaymentError = (errorMessage: string) => {
    setLastError(errorMessage);
    setPaymentAttempts(prev => prev + 1);
  };
  
  const handlePaymentRetry = () => {
    setLastError(null);
  };

  const handlePaymentInitiate = () => {
    setLastError(null);
    if (onPaymentInitiate) {
      onPaymentInitiate();
    }
  };

  const showRetryOption = paymentAttempts > 0 && lastError && !paymentInitiated;

  return (
    <div className="space-y-4 pt-4">
      {scriptError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We're having trouble connecting to our payment provider. 
            Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {lastError && !paymentInitiated && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>
            {lastError}
            {showRetryOption && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handlePaymentRetry}
              >
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {!lastError && paymentAttempts > 0 && !paymentInitiated && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Payment gateway ready. You can proceed with your payment.
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
          disabled={paymentInitiated}
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
          disabled={paymentInitiated}
        />
      </div>
      
      <PaystackPaymentHandler
        formData={formData}
        onSuccess={onPaymentComplete}
        onCancel={onClose}
        onError={handlePaymentError}
        onInitiate={handlePaymentInitiate}
        scriptLoaded={scriptLoaded}
        scriptError={scriptError}
        disabled={paymentInitiated}
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
