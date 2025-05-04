
import React from 'react';
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
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  
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

  // Mock payment process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Complete Payment</DialogTitle>
          <DialogDescription>
            Application fee: ₦2,000
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
            <label htmlFor="cardNumber" className="text-sm font-medium">
              Card Number
            </label>
            <Input 
              id="cardNumber" 
              placeholder="0000 0000 0000 0000" 
              value={cardNumber}
              onChange={handleCardNumberChange}
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date
              </label>
              <Input 
                id="expiryDate" 
                placeholder="MM/YY" 
                value={expiryDate}
                onChange={handleExpiryDateChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </label>
              <Input 
                id="cvv" 
                placeholder="123" 
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                required 
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={processing}
          >
            {processing ? "Processing..." : "Pay ₦2,000"}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            This is a demo payment form. No actual payment will be processed.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
