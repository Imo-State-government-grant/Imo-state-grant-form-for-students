
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NIGERIAN_BANKS, STUDY_LEVELS } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Application Submitted",
        description: "Your grant application has been successfully received. Thank you.",
      });
      
      // In a real app, this would be where you'd send actual SMS and email notifications
      console.log("SMS sent to:", formData.phoneNumber);
      console.log("Email sent to:", formData.email);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto my-12">
        <h2 className="text-2xl font-bold text-imogreen mb-4">Submission Successful</h2>
        <p className="mb-6">
          Your grant application has been successfully received. Thank you.
        </p>
        <p className="mb-6">
          A confirmation has been sent to your phone number and email address.
        </p>
        <Button 
          className="bg-imogreen hover:bg-imogreen-dark text-white" 
          onClick={() => setIsSubmitted(false)}
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          className="bg-white"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter your phone number"
          className="bg-white"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          className="bg-white"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nin">National Identification Number (NIN)</Label>
        <Input
          id="nin"
          name="nin"
          placeholder="Enter your NIN"
          className="bg-white"
          value={formData.nin}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
        <Input
          id="bvn"
          name="bvn"
          placeholder="Enter your BVN"
          className="bg-white"
          value={formData.bvn}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolName">School Name</Label>
        <Input
          id="schoolName"
          name="schoolName"
          placeholder="Enter your school name"
          className="bg-white"
          value={formData.schoolName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="studyLevel">Current Level of Study</Label>
        <Select
          name="studyLevel"
          value={formData.studyLevel}
          onValueChange={handleSelectChange("studyLevel")}
          required
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your current level of study" />
          </SelectTrigger>
          <SelectContent>
            {STUDY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Grant Amount (₦20,000 - ₦100,000)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="20000"
          max="100000"
          placeholder="Enter amount between ₦20,000 - ₦100,000"
          className="bg-white"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passport">Upload Passport Photograph</Label>
        <Input
          id="passport"
          name="passport"
          type="file"
          accept="image/*"
          className="bg-white"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">Bank Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          placeholder="Enter your account number"
          className="bg-white"
          value={formData.accountNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          name="accountName"
          placeholder="Enter your account name"
          className="bg-white"
          value={formData.accountName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank">Select Bank</Label>
        <Select
          name="bank"
          value={formData.bank}
          onValueChange={handleSelectChange("bank")}
          required
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_BANKS.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Why do you need this grant?</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Explain why you need this grant..."
          className="bg-white resize-none min-h-[150px]"
          value={formData.reason}
          onChange={handleInputChange}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full py-6 text-lg font-bold bg-imogreen-dark hover:bg-imogreen text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>

      <div className="text-center mt-8">
        <p className="text-[#ea384c] font-bold text-lg">Registration ends May 31</p>
        <p className="text-sm italic mt-2">
          Sponsored by the Government of Imo State Student Affairs in collaboration with the Imo State Ministry of Education.
        </p>
      </div>
    </form>
  );
};

export default GrantApplicationForm;
