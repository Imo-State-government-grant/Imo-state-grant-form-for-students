
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
      setLoading(false);
    };
    
    checkUser();
  }, [navigate]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <AuthBackground>
      <AuthCard title={isLogin ? "Login to Your Account" : "Create a New Account"}>
        <AuthForm 
          isLogin={isLogin} 
          loading={loading} 
          onToggleMode={toggleAuthMode} 
        />
      </AuthCard>
    </AuthBackground>
  );
};

export default Auth;
