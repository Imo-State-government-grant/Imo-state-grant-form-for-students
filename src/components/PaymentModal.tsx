
import React, { useState } from 'react';
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

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  formData: GrantFormData;
}

const PaymentModal = ({ open, onClose, onPaymentComplete, formData }: PaymentModalProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardNumber(formatted);
    }
  };

  // Format expiry date
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, "");
    if (value.length <= 4) {
      const formatted = value.replace(/(\d{2})(?=\d)/g, "$1/");
      setExpiryDate(formatted);
    }
  };

  // Initiate Paystack payment
  const handlePaystackPayment = () => {
    setProcessing(true);
    
    // Here you would normally integrate with Paystack's API
    // For demo purposes, we'll simulate a successful payment after a delay
    
    // In a real-world scenario, you'd use the Paystack SDK or API
    // Example of what this could look like (not actual implementation):
    // const paystack = new PaystackPop();
    // paystack.newTransaction({
    //   key: 'pk_test_your_public_key',
    //   email: formData.email,
    //   amount: 200000, // Amount in kobo (₦2,000)
    //   onSuccess: function(response) {
    //     setProcessing(false);
    //     onPaymentComplete();
    //   },
    //   onCancel: function() {
    //     setProcessing(false);
    //   }
    // });
    
    // For demo purposes, simulate successful payment
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
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
