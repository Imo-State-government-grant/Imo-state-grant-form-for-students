
import React from "react";

interface AuthBackgroundProps {
  children: React.ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div 
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
        style={{ opacity: 0.05 }}
      >
        <img 
          src="/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" 
          alt="Imo State Logo Watermark" 
          className="w-full max-w-3xl"
        />
      </div>
      {children}
    </div>
  );
};

export default AuthBackground;
