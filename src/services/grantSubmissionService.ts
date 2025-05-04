
import { GrantFormData } from "@/hooks/useGrantForm";
import { getSupabaseClient, isSupabaseConnected } from "@/lib/supabase";
import { ToastType } from "@/components/ui/use-toast";

export const submitGrantApplication = async (
  formData: GrantFormData, 
  toast: (props: ToastType) => void
): Promise<boolean> => {
  try {
    // Check if Supabase is connected before proceeding
    if (!isSupabaseConnected()) {
      toast({
        title: "Supabase Not Connected",
        description: "Please connect to Supabase to submit your application.",
        variant: "destructive",
      });
      return false;
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
