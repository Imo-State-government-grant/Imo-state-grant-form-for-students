
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIAN_BANKS } from "@/lib/constants";
import FormSection from "./FormSection";

interface BankInfoFieldsProps {
  formData: {
    accountNumber: string;
    accountName: string;
    bank: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string) => (value: string) => void;
}

const BankInfoFields = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange 
}: BankInfoFieldsProps) => {
  return (
    <>
      <FormSection id="accountNumber" label="Bank Account Number" required>
        <Input
          id="accountNumber"
          name="accountNumber"
          placeholder="Enter your account number"
          className="bg-white border-gray-300"
          value={formData.accountNumber}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="accountName" label="Account Name" required>
        <Input
          id="accountName"
          name="accountName"
          placeholder="Enter your account name"
          className="bg-white border-gray-300"
          value={formData.accountName}
          onChange={handleInputChange}
          required
        />
      </FormSection>

      <FormSection id="bank" label="Select Bank" required>
        <Select
          name="bank"
          value={formData.bank}
          onValueChange={handleSelectChange("bank")}
          required
        >
          <SelectTrigger className="bg-white border-gray-300">
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
      </FormSection>
    </>
  );
};

export default BankInfoFields;
