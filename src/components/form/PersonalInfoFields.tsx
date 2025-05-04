
import React from "react";
import { Input } from "@/components/ui/input";
import FormSection from "./FormSection";

interface PersonalInfoFieldsProps {
  formData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    nin: string;
    bvn: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields = ({ formData, handleInputChange }: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormSection id="fullName" label="Full Name" required>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          className="bg-white border-gray-300"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="phoneNumber" label="Phone Number" required>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter your phone number"
          className="bg-white border-gray-300"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="email" label="Email Address" required>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          className="bg-white border-gray-300"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="nin" label="National Identification Number (NIN)" required>
        <Input
          id="nin"
          name="nin"
          placeholder="Enter your NIN"
          className="bg-white border-gray-300"
          value={formData.nin}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="bvn" label="Bank Verification Number (BVN)" required>
        <Input
          id="bvn"
          name="bvn"
          placeholder="Enter your BVN"
          className="bg-white border-gray-300"
          value={formData.bvn}
          onChange={handleInputChange}
          required
        />
      </FormSection>
    </>
  );
};

export default PersonalInfoFields;
