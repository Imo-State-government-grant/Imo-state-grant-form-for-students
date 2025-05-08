
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GrantFormData } from "@/hooks/useGrantForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaystackPaymentHandlerProps {
  formData: GrantFormData;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
  onInitiate: () => void;
  scriptLoaded: boolean;
  scriptError: boolean;
  disabled?: boolean;
}

const PaystackPaymentHandler = ({ 
  formData, 
  onSuccess, 
  onCancel, 
  onError,
  onInitiate,
  scriptLoaded, 
  scriptError,
  disabled
}: PaystackPaymentHandlerProps) => {
  const { toast } = useToast();
  const [processing, setProcessing] = React.useState(false);
  const [paymentInitialized, setPaymentInitialized] = React.useState(false);
  
  const handlePaystackPayment = async () => {
    if (processing || paymentInitialized || disabled) return; // Prevent multiple clicks or re-initialization
    
    try {
      setProcessing(true);
      onInitiate();
      
      // Check authentication status
      const { data, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Authentication failed. Please try logging in again.");
      }
      
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "Please login to proceed with payment",
          variant: "destructive",
        });
        setProcessing(false);
        onError("Authentication required. Please log in to continue.");
        onCancel();
        return;
      }
      
      // Verify Paystack script is loaded
      if (!scriptLoaded || !window.PaystackPop) {
        toast({
          title: "Payment Service Unavailable",
          description: "The payment service is currently unavailable. Please refresh the page and try again.",
          variant: "destructive",
        });
        setProcessing(false);
        onError("Payment service is unavailable. Please refresh and try again.");
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
          onSuccess: async function(response: any) {
            console.log("Payment successful:", response);
            console.log("Payment reference:", reference);
            
            try {
              // Verify transaction with Supabase
              await verifyAndStoreTransaction(reference, data.session!.user.id);
              
              setProcessing(false);
              toast({
                title: "Payment Successful",
                description: "Your application fee has been received. Your reference is: " + reference,
              });
              
              onSuccess();
            } catch (verifyError) {
              console.error("Verification error:", verifyError);
              setProcessing(false);
              setPaymentInitialized(false);
              onError("Payment verification failed. Please contact support with reference: " + reference);
            }
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
            onCancel();
          },
          onClose: function() {
            console.log("Payment modal closed");
            setProcessing(false);
            setPaymentInitialized(false);
          },
          callback: function(response: any) {
            // Additional callback for transaction verification
            console.log("Payment callback received:", response);
          },
          metadata: {
            application_id: reference,
            full_name: formData.fullName,
            user_id: data.session!.user.id,
            school: formData.schoolName
          },
        });
      } catch (paystackError: any) {
        console.error("Paystack initialization error:", paystackError);
        setProcessing(false);
        setPaymentInitialized(false);
        
        const errorMessage = paystackError?.message || "Failed to initialize payment";
        toast({
          title: "Payment Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        onError(errorMessage);
      }
    } catch (error: any) {
      console.error("Payment process error:", error);
      setProcessing(false);
      setPaymentInitialized(false);
      
      const errorMessage = error?.message || "There was a problem processing your payment";
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError(errorMessage);
    }
  };
  
  // Function to verify and store transaction in database
  const verifyAndStoreTransaction = async (reference: string, userId: string) => {
    try {
      // Log payment in database
      const { error } = await supabase.from('grant_applications')
        .update({ 
          payment_status: 'completed', 
          payment_reference: reference,
          payment_date: new Date().toISOString(),
          payment_amount: 2000 // ₦2,000
        })
        .eq('user_id', userId);
        
      if (error) {
        console.error("Database update error:", error);
        throw new Error("Failed to record payment in database");
      }
      
      // Here you would typically also verify the payment with Paystack's API
      // in a real production application (using an edge function)
      
      return true;
    } catch (error) {
      console.error("Transaction verification error:", error);
      throw error;
    }
  };

  return (
    <Button 
      onClick={handlePaystackPayment} 
      className="w-full py-6 text-lg font-bold bg-[#0BA4DB] hover:bg-[#0994C8] text-white"
      disabled={processing || scriptError || !scriptLoaded || disabled}
    >
      {processing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay ₦2,000 with Paystack"
      )}
    </Button>
  );
};

export default PaystackPaymentHandler;
