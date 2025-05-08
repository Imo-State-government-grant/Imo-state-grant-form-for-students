
import React, { useState, useEffect } from 'react';
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
import { Progress } from "@/components/ui/progress";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  formData: GrantFormData;
}

const PaymentModal = ({ open, onClose, onPaymentComplete, formData }: PaymentModalProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleScriptLoaded = () => {
    setScriptLoaded(true);
    setScriptError(false);
    setLoadingProgress(100);
  };
  
  const handleScriptError = () => {
    setScriptError(true);
    setScriptLoaded(false);
    setLoadingProgress(0);
  };

  const handlePaymentInitiate = () => {
    setPaymentInitiated(true);
  };

  const handleRefreshScript = () => {
    setScriptError(false);
    setLoadingProgress(10);
    setRefreshTrigger(prev => prev + 1);
  };

  // Simulate loading progress
  useEffect(() => {
    if (open && !scriptLoaded && !scriptError) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [open, scriptLoaded, scriptError, refreshTrigger]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPaymentInitiated(false);
      }, 300);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Pay with Paystack</DialogTitle>
          <DialogDescription>
            Application fee: ₦2,000
          </DialogDescription>
        </DialogHeader>
        
        {!scriptLoaded && !scriptError && (
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              {loadingProgress < 100 ? "Loading payment system..." : "Ready to process payment"}
            </p>
            <Progress value={loadingProgress} />
          </div>
        )}
        
        {scriptError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-2">
              <span>Failed to load payment system. Please check your internet connection and try again.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshScript}
                className="flex items-center gap-2 self-start"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry Loading
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {open && (
          <PaystackScriptLoader 
            key={`paystack-loader-${refreshTrigger}`}
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
          onPaymentInitiate={handlePaymentInitiate}
          paymentInitiated={paymentInitiated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
