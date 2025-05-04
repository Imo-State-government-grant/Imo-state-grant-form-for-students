
import GrantApplicationForm from "@/components/GrantApplicationForm";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Watermark */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
        style={{
          opacity: 0.05, // 95% transparent
        }}
      >
        <img 
          src="/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" 
          alt="Imo State Logo Watermark" 
          className="w-full max-w-3xl"
        />
      </div>
      
      <Navigation />
      <div className="py-8 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <img 
              src="/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" 
              alt="Imo State Logo" 
              className="w-32 h-32 mb-6"
            />
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-imogreen-dark text-center">
              IMO STATE GOVERNMENT GRANT FOR STUDENTS
            </h1>
            <p className="text-lg md:text-xl text-black">Caring for the leaders of tomorrow</p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <GrantApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
