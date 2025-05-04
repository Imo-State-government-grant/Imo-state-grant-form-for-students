
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  // Prefill email if user is logged in
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setFormData((prev) => ({ ...prev, email: data.user!.email! }));
      }
    };
    
    getUser();
  }, []);

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
