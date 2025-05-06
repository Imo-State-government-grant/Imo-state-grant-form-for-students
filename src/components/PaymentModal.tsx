
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
  
  // Optimize the Paystack script loading
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) return;
    
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('Paystack script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      toast({
        title: "Payment Service Error",
        description: "Failed to load payment service. Please try again later.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
    
    return () => {
      // Only remove if we added it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [toast]);

  // Improved Paystack payment handler
  const handlePaystackPayment = () => {
    if (processing) return; // Prevent multiple clicks
    setProcessing(true);
    
    if (!window.PaystackPop) {
      toast({
        title: "Payment Service Unavailable",
        description: "The payment service is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }
    
    try {
      const paystack = new window.PaystackPop();
      const reference = `grant-app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      paystack.newTransaction({
        key: 'pk_live_af863ca7dcc4f225cf99bc4d863c2bbd2d4e5443', // Updated Paystack public key
        email: formData.email,
        amount: 200000, // Amount in kobo (₦2,000)
        currency: 'NGN',
        ref: reference,
        firstname: formData.fullName?.split(' ')[0] || '',
        lastname: formData.fullName?.split(' ')[1] || '',
        metadata: {
          application_id: reference,
          full_name: formData.fullName,
          school: formData.schoolName // Fixed: changed from institution to schoolName to match GrantFormData type
        },
        onSuccess: function() {
          setProcessing(false);
          toast({
            title: "Payment Successful",
            description: "Your application fee has been received. Your reference is: " + reference,
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
        },
        onClose: function() {
          setProcessing(false);
        }
      });
    } catch (error) {
      console.error("Paystack error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
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
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Your payment information is secure. Transaction ID: {`grant-${Date.now().toString().slice(-6)}`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
