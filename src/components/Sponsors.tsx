
import React from 'react';

const Sponsors = () => {
  const sponsors = [
    { name: 'Microfinance Opportunities', src: '/lovable-uploads/6a5ac191-a017-470a-a00f-a8c6e3fbbbf8.png' },
    { name: 'Access Bank', src: '/lovable-uploads/ec9630cb-816b-499e-af01-09a35a16c134.png' },
    { name: 'UBA', src: '/lovable-uploads/b7546141-2868-417a-963e-855b4fc47685.png' },
    { name: 'Fidelity Bank', src: '/lovable-uploads/a7bb12d7-b316-4e6d-99da-f81ac7a1f5c4.png' },
    { name: 'First Bank', src: '/lovable-uploads/9c8bfd16-2c04-4223-a903-f1c300123784.png' },
    { name: 'Zenith Bank', src: '/lovable-uploads/4ed38046-1afb-4cc5-aa03-f69dc62ddf4b.png' },
  ];

  return (
    <div className="mt-12 mb-6">
      <p className="text-center text-sm text-gray-500 mb-4">Sponsored by</p>
      <div className="flex flex-wrap justify-center items-center gap-6 px-4">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="h-12 w-24 flex items-center justify-center">
            <img 
              src={sponsor.src} 
              alt={sponsor.name} 
              className="max-h-12 max-w-full object-contain"
              onError={(e) => {
                // For debugging
                console.log(`Image failed to load: ${sponsor.src}`);
                // Use a placeholder image if the original source fails
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x50?text=Sponsor";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;
