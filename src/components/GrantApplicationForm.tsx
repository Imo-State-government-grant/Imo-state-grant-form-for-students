
import React from "react";
import PersonalInfoFields from "./form/PersonalInfoFields";
import AcademicInfoFields from "./form/AcademicInfoFields";
import BankInfoFields from "./form/BankInfoFields";
import FormFooter from "./form/FormFooter";
import SuccessMessage from "./form/SuccessMessage";
import { useGrantForm } from "@/hooks/useGrantForm";
import { validateGrantForm } from "@/lib/formValidation";
import { submitGrantApplication } from "@/services/grantSubmissionService";

const GrantApplicationForm = () => {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    setIsSubmitting,
    setIsSubmitted,
    resetForm,
    toast
  } = useGrantForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateGrantForm(formData, toast)) return;
    
    setIsSubmitting(true);
    
    const success = await submitGrantApplication(formData, toast);
    if (success) {
      setIsSubmitted(true);
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return <SuccessMessage onReset={resetForm} />;
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
