
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PersonalInfoFields from "./form/PersonalInfoFields";
import AcademicInfoFields from "./form/AcademicInfoFields";
import BankInfoFields from "./form/BankInfoFields";
import FormFooter from "./form/FormFooter";
import SuccessMessage from "./form/SuccessMessage";
import { getSupabaseClient, isSupabaseConnected } from "@/lib/supabase";

const GrantApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    nin: "",
    bvn: "",
    schoolName: "",
    studyLevel: "",
    passport: null as File | null,
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

  const validateForm = () => {
    // Simple validation - check if required fields are filled
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
      if (!formData[field as keyof typeof formData]) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if Supabase is connected before proceeding
      if (!isSupabaseConnected()) {
        toast({
          title: "Supabase Not Connected",
          description: "Please connect to Supabase to submit your application.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Get the Supabase client safely
      const supabase = getSupabaseClient();
      
      // Upload passport photo to Supabase Storage
      let passportUrl = "";
      if (formData.passport) {
        const file = formData.passport;
        const fileExt = file.name.split('.').pop();
        const fileName = `${formData.nin}-${Date.now()}.${fileExt}`;
        
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('passports')
          .upload(fileName, file);
          
        if (fileError) {
          throw fileError;
        }
        
        passportUrl = fileData.path;
      }
      
      // Save application data to Supabase
      const { error } = await supabase
        .from('grant_applications')
        .insert({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          nin: formData.nin,
          bvn: formData.bvn,
          school_name: formData.schoolName,
          study_level: formData.studyLevel,
          passport_url: passportUrl,
          account_number: formData.accountNumber,
          account_name: formData.accountName,
          bank: formData.bank,
          amount: Number(formData.amount),
          reason: formData.reason,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      
      toast({
        title: "Application Submitted",
        description: "Your grant application has been successfully received. Thank you.",
      });
      
      // In a real app, this would be where you'd send actual SMS and email notifications
      console.log("Application submitted to database for:", formData.phoneNumber);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <SuccessMessage onReset={() => setIsSubmitted(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      <PersonalInfoFields 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />
      
      <AcademicInfoFields 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleFileChange={handleFileChange}
      />
      
      <BankInfoFields 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />

      <FormFooter isSubmitting={isSubmitting} />
    </form>
  );
};

export default GrantApplicationForm;
