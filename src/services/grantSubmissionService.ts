
import { GrantFormData } from "@/hooks/useGrantForm";
import { supabase } from "@/integrations/supabase/client";
import { ToastFunction } from "@/types/toast";

export const submitGrantApplication = async (
  formData: GrantFormData, 
  toast: ToastFunction
): Promise<boolean> => {
  try {
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit your application",
        variant: "destructive",
      });
      return false;
    }

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
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('passports')
        .getPublicUrl(fileData.path);
        
      passportUrl = urlData.publicUrl;
    }
    
    // Save application data to Supabase
    const { error } = await supabase
      .from('grant_applications')
      .insert({
        user_id: user.id,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        nin: formData.nin,
        bvn: "N/A", // Set to N/A since we removed the field
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
    
    toast({
      title: "Application Submitted",
      description: "Your grant application has been successfully received. Thank you.",
    });
    
    // In a real app, this would be where you'd send actual SMS and email notifications
    console.log("Application submitted to database for:", formData.phoneNumber);
    return true;
  } catch (error) {
    console.error("Error submitting application:", error);
    toast({
      title: "Submission Failed",
      description: "There was a problem submitting your application. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
