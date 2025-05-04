
import React from "react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto my-12">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Submission Successful</h2>
      <p className="mb-6 text-black">
        Your grant application has been successfully received. Thank you.
      </p>
      <p className="mb-6 text-black">
        A confirmation has been sent to your phone number and email address.
      </p>
      <Button 
        className="bg-black hover:bg-gray-800 text-white" 
        onClick={onReset}
      >
        Submit Another Application
      </Button>
    </div>
  );
};

export default SuccessMessage;
