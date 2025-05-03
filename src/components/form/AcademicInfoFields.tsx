
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STUDY_LEVELS } from "@/lib/constants";
import FormSection from "./FormSection";

interface AcademicInfoFieldsProps {
  formData: {
    schoolName: string;
    studyLevel: string;
    amount: string;
    reason: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string) => (value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AcademicInfoFields = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange,
  handleFileChange 
}: AcademicInfoFieldsProps) => {
  return (
    <>
      <FormSection id="schoolName" label="School Name">
        <Input
          id="schoolName"
          name="schoolName"
          placeholder="Enter your school name"
          className="bg-white"
          value={formData.schoolName}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="studyLevel" label="Current Level of Study">
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
      </FormSection>

      <FormSection id="amount" label="Grant Amount (₦20,000 - ₦100,000)">
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
      </FormSection>

      <FormSection id="passport" label="Upload Passport Photograph">
        <Input
          id="passport"
          name="passport"
          type="file"
          accept="image/*"
          className="bg-white"
          onChange={handleFileChange}
          required
        />
      </FormSection>

      <FormSection id="reason" label="Why do you need this grant?">
        <Textarea
          id="reason"
          name="reason"
          placeholder="Explain why you need this grant..."
          className="bg-white resize-none min-h-[150px]"
          value={formData.reason}
          onChange={handleInputChange}
          required
        />
      </FormSection>
    </>
  );
};

export default AcademicInfoFields;
