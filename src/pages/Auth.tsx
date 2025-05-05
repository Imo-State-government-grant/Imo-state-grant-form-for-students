
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { Github } from "lucide-react"; // Using Github icon instead of Google as a temporary replacement

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
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

  const handleAuth = async (e: React.FormEvent) => {
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0], // For simplicity
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Registration successful",
          description: "Please check your email for a confirmation link",
        });
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

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred signing in with Google",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
    // No need for finally block as the page will redirect
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
          <form onSubmit={handleAuth} className="space-y-4">
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold bg-black hover:bg-gray-800 text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-lg font-medium border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <Github className="mr-2 h-5 w-5" /> {/* Using GitHub icon instead of Google */}
              {googleLoading ? "Connecting..." : "Sign in with Google"}
            </Button>

            <p className="text-center mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
