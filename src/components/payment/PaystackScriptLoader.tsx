
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PaystackScriptLoaderProps {
  onScriptLoaded: () => void;
  onScriptError: () => void;
}

const PaystackScriptLoader = ({ onScriptLoaded, onScriptError }: PaystackScriptLoaderProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Track script loading attempts
    let attempts = 0;
    const maxAttempts = 3; // Increased from 2 to 3
    
    const loadScript = () => {
      // Check if script is already loaded
      if (window.PaystackPop) {
        console.log('Paystack script already loaded');
        onScriptLoaded();
        return;
      }
      
      attempts += 1;
      console.log(`Loading Paystack script (attempt ${attempts})`);
      
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js'; // Make sure this is the correct URL
      script.async = true;
      
      // Create a timeout to detect script loading issues
      const timeoutId = setTimeout(() => {
        if (!window.PaystackPop) {
          console.error('Paystack script load timeout');
          
          if (attempts < maxAttempts) {
            console.log(`Retrying script load (${attempts}/${maxAttempts})`);
            document.body.removeChild(script);
            loadScript();
          } else {
            onScriptError();
            toast({
              title: "Payment Service Timeout",
              description: "The payment service is taking too long to load. Please try again later or check your internet connection.",
              variant: "destructive",
            });
          }
        }
      }, 15000); // Increased from 10 to 15 seconds
      
      script.onload = () => {
        console.log('Paystack script loaded successfully');
        clearTimeout(timeoutId);
        
        // Verify that PaystackPop is actually available
        if (window.PaystackPop) {
          console.log('PaystackPop object is available');
          onScriptLoaded();
        } else {
          console.error('Script loaded but PaystackPop not available');
          if (attempts < maxAttempts) {
            console.log(`Retrying script load (${attempts}/${maxAttempts})`);
            document.body.removeChild(script);
            loadScript();
          } else {
            onScriptError();
            toast({
              title: "Payment Service Error",
              description: "Failed to initialize payment service. Please try again later.",
              variant: "destructive",
            });
          }
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        clearTimeout(timeoutId);
        
        if (attempts < maxAttempts) {
          console.log(`Retrying script load (${attempts}/${maxAttempts})`);
          document.body.removeChild(script);
          loadScript();
        } else {
          onScriptError();
          toast({
            title: "Payment Service Error",
            description: "Failed to load payment service. Please check your internet connection and try again.",
            variant: "destructive",
          });
        }
      };
      
      // Remove any existing scripts to prevent duplicates
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      document.body.appendChild(script);
    };
    
    // Start loading the script
    loadScript();
    
    return () => {
      // We don't remove the script on unmount to prevent reloading issues
    };
  }, [onScriptLoaded, onScriptError, toast]);

  return null; // This is a utility component with no UI
};

export default PaystackScriptLoader;
