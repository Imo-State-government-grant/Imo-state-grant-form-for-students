
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseClient, isSupabaseConnected } from "@/lib/supabase";

export type GrantFormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  nin: string;
  bvn: string;
  schoolName: string;
  studyLevel: string;
  passport: File | null;
  accountNumber: string;
  accountName: string;
  bank: string;
  amount: string;
  reason: string;
};

export const useGrantForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<GrantFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    nin: "",
    bvn: "",
    schoolName: "",
    studyLevel: "",
    passport: null,
    accountNumber: "",
    accountName: "",
    bank: "",
    amount: "",
    reason: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, passport: e.target.files![0] }));
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      nin: "",
      bvn: "",
      schoolName: "",
      studyLevel: "",
      passport: null,
      accountNumber: "",
      accountName: "",
      bank: "",
      amount: "",
      reason: "",
    });
  };

  return {
    formData,
    isSubmitting,
    isSubmitted,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    setIsSubmitting,
    setIsSubmitted,
    resetForm,
    toast,
  };
};
