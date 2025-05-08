import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GrantFormData } from "@/hooks/useGrantForm";
import { Button } from "@/components/ui/button";

interface PaystackPaymentHandlerProps {
  formData: GrantFormData;
  onSuccess: () => void;
  onCancel: () => void;
  scriptLoaded: boolean;
  scriptError: boolean;
}

const PaystackPaymentHandler = ({ 
  formData, 
  onSuccess, 
  onCancel, 
  scriptLoaded, 
  scriptError 
}: PaystackPaymentHandlerProps) => {
  const { toast } = useToast();
  const [processing, setProcessing] = React.useState(false);
  const [paymentInitialized, setPaymentInitialized] = React.useState(false);
  
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
              
            onSuccess();
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
        setPaymentInitialized(false);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment process error:", error);
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
    <Button 
      onClick={handlePaystackPayment} 
      className="w-full py-6 text-lg font-bold bg-[#0BA4DB] hover:bg-[#0994C8] text-white"
      disabled={processing || scriptError || !scriptLoaded}
    >
      {processing ? "Processing..." : "Pay ₦2,000 with Paystack"}
    </Button>
  );
};

export default PaystackPaymentHandler;
