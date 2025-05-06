
import React from "react";
import { Button } from "@/components/ui/button";
import Sponsors from "@/components/Sponsors";

interface FormFooterProps {
  isSubmitting: boolean;
}

const FormFooter = ({ isSubmitting }: FormFooterProps) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full py-6 text-lg font-bold bg-black hover:bg-gray-800 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>

      <div className="text-center mt-8">
        <p className="text-[#ea384c] font-bold text-lg">Registration ends May 31st, 2025</p>
        <p className="text-sm italic mt-2 text-black">
          Sponsored by the Government of Imo State Student Affairs in collaboration with the Imo State Ministry of Education.
        </p>
      </div>
      
      <Sponsors />
    </>
  );
};

export default FormFooter;
