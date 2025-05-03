
import React from "react";
import { Label } from "@/components/ui/label";

interface FormSectionProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

const FormSection = ({ id, label, children }: FormSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};

export default FormSection;
