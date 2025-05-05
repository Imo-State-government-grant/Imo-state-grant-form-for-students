
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrantFormData } from "@/hooks/useGrantForm";
import { useToast } from "@/hooks/use-toast";

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
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  // Add Paystack script to the document
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initiate Paystack payment
  const handlePaystackPayment = () => {
    setProcessing(true);
    
    if (window.PaystackPop) {
      try {
        const paystack = new window.PaystackPop();
        paystack.newTransaction({
          key: 'pk_live_af863ca7dcc4f225cf99bc4d863c2bbd2d4e5443',
          email: formData.email,
          amount: 200000, // Amount in kobo (₦2,000)
          currency: 'NGN',
          ref: `grant-app-${Date.now()}`, // Generate a unique reference
          firstname: formData.fullName.split(' ')[0],
          lastname: formData.fullName.split(' ')[1] || '',
          onSuccess: function() {
            setProcessing(false);
            toast({
              title: "Payment Successful",
              description: "Your application fee has been received.",
            });
            onPaymentComplete();
          },
          onCancel: function() {
            setProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            });
          }
        });
      } catch (error) {
        // Fallback in case of errors
        console.error("Paystack error:", error);
        toast({
          title: "Payment Error",
          description: "There was a problem processing your payment. Please try again.",
          variant: "destructive",
        });
        setProcessing(false);
      }
    } else {
      // Fallback if script wasn't loaded
      toast({
        title: "Payment Service Unavailable",
        description: "The payment service is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      setProcessing(false);
    }
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
        
        <div className="space-y-4 pt-4">
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
          
          <Button 
            onClick={handlePaystackPayment} 
            className="w-full py-6 text-lg font-bold bg-[#0BA4DB] hover:bg-[#0994C8] text-white"
            disabled={processing}
          >
            {processing ? "Processing..." : "Pay ₦2,000 with Paystack"}
          </Button>
          
          <div className="flex justify-center mt-2">
            <img 
              src="https://assets.paystack.com/assets/img/logos/powered-by-paystack.svg" 
              alt="Powered by Paystack" 
              className="h-8" 
            />
          </div>
          
          <p className="text-xs text-center text-gray-500">
            This is a demo payment form. No actual payment will be processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
