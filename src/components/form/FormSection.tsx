
import React from "react";
import { Label } from "@/components/ui/label";

interface FormSectionProps {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

const FormSection = ({ id, label, children, required = false }: FormSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-black font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
};

export default FormSection;
