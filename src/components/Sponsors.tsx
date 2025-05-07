
import React from "react";

interface Sponsor {
  name: string;
  src: string;
}

const sponsors: Sponsor[] = [
  { name: "Ministry of Education", src: "/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" },
  { name: "Imo State Government", src: "/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" },
  { name: "Student Affairs", src: "/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png" },
];

const Sponsors = () => {
  return (
    <div className="mt-8">
      <p className="text-center font-medium mb-4">Our Sponsors</p>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="flex items-center justify-center w-32 h-20 bg-white p-2 rounded shadow-sm">
            <img 
              src={sponsor.src} 
              alt={sponsor.name} 
              className="max-h-12 max-w-full object-contain"
              onError={(e) => {
                // Use state logo as fallback
                (e.target as HTMLImageElement).src = "/lovable-uploads/4e9380de-3679-400a-a35e-bba29bcc581e.png";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;
