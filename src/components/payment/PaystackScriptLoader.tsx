
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PaystackScriptLoaderProps {
  onScriptLoaded: () => void;
  onScriptError: () => void;
}

const PaystackScriptLoader = ({ onScriptLoaded, onScriptError }: PaystackScriptLoaderProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      console.log('Paystack script already loaded');
      onScriptLoaded();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    
    // Create a timeout to detect script loading issues
    const timeoutId = setTimeout(() => {
      if (!window.PaystackPop) {
        console.error('Paystack script load timeout');
        onScriptError();
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
      onScriptLoaded();
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      clearTimeout(timeoutId);
      onScriptError();
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
  }, [onScriptLoaded, onScriptError, toast]);

  return null; // This is a utility component with no UI
};

export default PaystackScriptLoader;
