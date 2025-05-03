
import React from "react";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
  isSubmitting: boolean;
}

const FormFooter = ({ isSubmitting }: FormFooterProps) => {
  return (
    <>
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
    </>
  );
};

export default FormFooter;
