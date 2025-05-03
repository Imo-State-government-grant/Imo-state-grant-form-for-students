
import React from "react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto my-12">
      <h2 className="text-2xl font-bold text-imogreen mb-4">Submission Successful</h2>
      <p className="mb-6">
        Your grant application has been successfully received. Thank you.
      </p>
      <p className="mb-6">
        A confirmation has been sent to your phone number and email address.
      </p>
      <Button 
        className="bg-imogreen hover:bg-imogreen-dark text-white" 
        onClick={onReset}
      >
        Submit Another Application
      </Button>
    </div>
  );
};

export default SuccessMessage;
