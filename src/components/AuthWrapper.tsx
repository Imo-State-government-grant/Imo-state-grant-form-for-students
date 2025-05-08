
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authCheckProgress, setAuthCheckProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Simulate progress
    if (loading) {
      const interval = setInterval(() => {
        setAuthCheckProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setAuthCheckProgress(100);
    }
  }, [loading]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_IN') {
          setSession(currentSession);
          
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            toast({
              title: "Signed in successfully",
              description: `Welcome back, ${currentSession?.user.email}!`,
            });
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          cleanupAuthState();
          navigate('/auth');
        } else if (event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
        } else if (event === 'USER_UPDATED') {
          setSession(currentSession);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        cleanupAuthState();
        navigate("/auth");
      } else {
        setSession(currentSession);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (!loading && !session) {
      console.log("No session found, redirecting to auth page");
      navigate("/auth");
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="text-center space-y-2 max-w-md px-4">
          <h2 className="text-xl font-semibold">Verifying your session...</h2>
          <p className="text-muted-foreground">Please wait while we verify your login credentials</p>
        </div>
        <div className="w-full max-w-md px-4">
          <Progress value={authCheckProgress} className="h-2" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
