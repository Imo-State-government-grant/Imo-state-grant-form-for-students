import { GrantFormData } from "@/hooks/useGrantForm";
import { ToastFunction } from "@/types/toast";

export const validateGrantForm = (formData: GrantFormData, toast: ToastFunction): boolean => {
  // Check required fields
  const requiredFields = [
    "fullName",
    "phoneNumber",
    "email",
    "nin",
    "bvn",
    "schoolName",
    "studyLevel",
    "accountNumber",
    "accountName",
    "bank",
    "amount",
    "reason",
  ];

  for (const field of requiredFields) {
    if (!formData[field as keyof GrantFormData]) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields.`,
        variant: "destructive",
      });
      return false;
    }
  }

  // Validate amount is within range
  const amountValue = Number(formData.amount);
  if (isNaN(amountValue) || amountValue < 20000 || amountValue > 100000) {
    toast({
      title: "Invalid amount",
      description: "Please enter an amount between ₦20,000 and ₦100,000",
      variant: "destructive",
    });
    return false;
  }

  if (!formData.passport) {
    toast({
      title: "Missing passport",
      description: "Please upload your passport photograph.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};
