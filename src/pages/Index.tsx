
import { GrantApplicationForm } from "@/components/GrantApplicationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-imogreen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            IMO STATE GOVERNMENT GRANT FOR STUDENTS
          </h1>
          <p className="text-lg md:text-xl">Caring for the leaders of tomorrow</p>
        </div>
        
        <div className="bg-white bg-opacity-95 shadow-lg rounded-lg p-6 md:p-8">
          <GrantApplicationForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
