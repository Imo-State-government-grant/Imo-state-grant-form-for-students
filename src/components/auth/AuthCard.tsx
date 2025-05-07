
import React from "react";
import Logo from "./Logo";

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md z-10">
      <Logo />
      <p className="text-lg md:text-xl text-black mb-4 text-center">
        {title}
      </p>

      <div className="bg-white shadow-lg rounded-lg p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
