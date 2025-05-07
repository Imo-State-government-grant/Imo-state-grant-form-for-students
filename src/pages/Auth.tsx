
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, UserCircle, Phone } from "lucide-react";

const Auth = () => {
  // Authentication method states
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  
  // Email auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Phone auth states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Shared states
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [navigate]);

  const validateNigerianPhoneNumber = (phone: string) => {
    // Nigerian phone numbers generally follow these patterns:
    // +234xxxxxxxxxx or 0xxxxxxxxxx (where x is a digit)
    const nigerianPhoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    return nigerianPhoneRegex.test(phone);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format phone number to international format if needed
      let formattedPhoneNumber = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhoneNumber = '+234' + phoneNumber.substring(1);
      } else if (!phoneNumber.startsWith('+')) {
        formattedPhoneNumber = '+' + phoneNumber;
      }

      if (!validateNigerianPhoneNumber(formattedPhoneNumber)) {
        throw new Error("Please enter a valid Nigerian phone number");
      }

      if (!otpSent) {
        // Send OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhoneNumber,
        });
        
        if (error) throw error;
        
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "We've sent a verification code to your phone",
        });
      } else {
        // Verify OTP
        const { error } = await supabase.auth.verifyOtp({
          phone: formattedPhoneNumber,
          token: otp,
          type: isLogin ? 'sms' : 'signup',
        });
        
        if (error) throw error;
        
        toast({
          title: isLogin ? "Login successful" : "Registration successful",
          description: `Welcome ${isLogin ? 'back ' : ''}to Imo State Student Grant Application`,
        });
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back to Imo State Student Grant Application",
        });
        
        navigate("/");
      } else {
        // Registration flow - immediately signs in after successful registration
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0], // For simplicity
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Automatically sign in after registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        
        toast({
          title: "Registration successful",
          description: "Welcome to Imo State Student Grant Application",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center" style={{ opacity: 0.05 }}>
        <img src="/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" alt="Imo State Logo Watermark" className="w-full max-w-3xl" />
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png"
            alt="Imo State Logo"
            className="w-32 h-32 mb-6"
          />
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-imogreen-dark text-center">
            IMO STATE STUDENT GRANT
          </h1>
          <p className="text-lg md:text-xl text-black mb-4">
            {isLogin ? "Login to Your Account" : "Create a New Account"}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <Tabs defaultValue="email" onValueChange={(value) => setAuthMethod(value as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters and not commonly used
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-bold bg-black hover:bg-gray-800 text-white"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Login" : "Register"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                {!otpSent ? (
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+2348012345678 or 08012345678"
                      required
                    />
                    <p className="text-xs text-gray-500">Enter your Nigerian phone number with country code</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="otp" className="block text-sm font-medium">
                        Verification Code
                      </label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the code sent to your phone"
                        required
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resetPhoneAuth}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Use a different phone number
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-bold bg-black hover:bg-gray-800 text-white"
                  disabled={loading}
                >
                  {loading 
                    ? "Processing..." 
                    : !otpSent 
                      ? "Send Verification Code" 
                      : isLogin 
                        ? "Login" 
                        : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setOtpSent(false);
                setOtp("");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
