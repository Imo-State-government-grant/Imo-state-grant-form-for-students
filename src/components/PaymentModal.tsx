
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
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const { toast } = useToast();
  
  // Improved script loading with better error handling
  useEffect(() => {
    if (!open) return; // Only load when modal is open
    
    // Reset states when modal opens
    setScriptError(false);
    setScriptLoaded(false);
    setPaymentInitialized(false);
    
    // Check if script is already loaded
    if (window.PaystackPop) {
      console.log('Paystack script already loaded');
      setScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    
    // Create a timeout to detect script loading issues
    const timeoutId = setTimeout(() => {
      if (!window.PaystackPop) {
        console.error('Paystack script load timeout');
        setScriptError(true);
        toast({
          title: "Payment Service Timeout",
          description: "The payment service is taking too long to load. Please try again later.",
          variant: "destructive",
        });
      }
    }, 10000); // 10 seconds timeout
    
    script.onload = () => {
      console.log('Paystack script loaded successfully');
      clearTimeout(timeoutId);
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      clearTimeout(timeoutId);
      setScriptError(true);
      toast({
        title: "Payment Service Error",
        description: "Failed to load payment service. Please try again later.",
        variant: "destructive",
      });
    };
    
    // Remove any existing scripts to prevent duplicates
    const existingScript = document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }
    
    document.body.appendChild(script);
    
    return () => {
      clearTimeout(timeoutId);
      // We don't remove the script on unmount to prevent reloading issues
    };
  }, [open, toast]);

  // Completely revamped payment handler with better error handling
  const handlePaystackPayment = async () => {
    if (processing || paymentInitialized) return; // Prevent multiple clicks or re-initialization
    
    try {
      setProcessing(true);
      
      // Check authentication status
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "Please login to proceed with payment",
          variant: "destructive",
        });
        setProcessing(false);
        onClose();
        return;
      }
      
      // Verify Paystack script is loaded
      if (!scriptLoaded || !window.PaystackPop) {
        setScriptError(true);
        toast({
          title: "Payment Service Unavailable",
          description: "The payment service is currently unavailable. Please refresh the page and try again.",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }
      
      console.log("Initializing Paystack payment...");
      setPaymentInitialized(true);
      
      // Generate a unique reference
      const reference = `img-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      
      try {
        const paystack = new window.PaystackPop();
        
        paystack.newTransaction({
          key: 'pk_live_af863ca7dcc4f225cf99bc4d863c2bbd2d4e5443',
          email: formData.email || data.session.user.email,
          amount: 200000, // Amount in kobo (₦2,000)
          currency: 'NGN',
          ref: reference,
          firstname: formData.fullName?.split(' ')[0] || '',
          lastname: formData.fullName?.split(' ').slice(1).join(' ') || '',
          onSuccess: async function() {
            console.log("Payment successful with reference:", reference);
            setProcessing(false);
            toast({
              title: "Payment Successful",
              description: "Your application fee has been received. Your reference is: " + reference,
            });
            
            // Log payment in database
            await supabase.from('grant_applications')
              .update({ 
                payment_status: 'completed', 
                payment_reference: reference,
                payment_date: new Date().toISOString(),
                payment_amount: 2000 // ₦2,000
              })
              .eq('user_id', data.session.user.id);
              
            onPaymentComplete();
          },
          onCancel: function() {
            console.log("Payment canceled");
            setProcessing(false);
            setPaymentInitialized(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            });
          },
          onClose: function() {
            console.log("Payment modal closed");
            setProcessing(false);
            setPaymentInitialized(false);
          },
          callback: function(response) {
            // Additional callback for transaction verification
            console.log("Payment callback received:", response);
          },
          metadata: {
            application_id: reference,
            full_name: formData.fullName,
            user_id: data.session.user.id,
            school: formData.schoolName
          },
        });
      } catch (paystackError) {
        console.error("Paystack initialization error:", paystackError);
        setScriptError(true);
        setPaymentInitialized(false);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment process error:", error);
      setScriptError(true);
      setPaymentInitialized(false);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
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
          
          <Button 
            onClick={handlePaystackPayment} 
            className="w-full py-6 text-lg font-bold bg-[#0BA4DB] hover:bg-[#0994C8] text-white"
            disabled={processing || scriptError || !scriptLoaded}
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
