import React from 'react';
import { Link } from 'react-router-dom';
import Testimonial from '@/components/Testimonial';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';

const About = () => {
  const testimonials = [
    {
      name: "Chinonso Okonkwo",
      school: "Federal University of Technology, Owerri",
      level: "300 Level",
      testimonial: "The Imo State Government grant helped me afford essential textbooks and research materials for my engineering project. I'm grateful for this support that has advanced my academic journey."
    },
    {
      name: "Adaeze Nwosu",
      school: "Imo State University",
      level: "400 Level",
      testimonial: "As a final year medical student, this grant allowed me to focus on my studies instead of worrying about finances. I can now complete my education with less stress."
    },
    {
      name: "Emeka Okafor",
      school: "Alvan Ikoku Federal College of Education",
      level: "HND2",
      testimonial: "The grant I received was instrumental in funding my final year project. The application process was straightforward and the funds were disbursed promptly."
    },
    {
      name: "Ngozi Eze",
      school: "Eastern Palm University",
      level: "200 Level",
      testimonial: "Being from a humble background, this grant has been a blessing. I can now afford accommodation closer to campus, saving me hours of commute daily."
    },
  ];

  return (
    <div className="min-h-screen bg-imogreen">
      <Navigation />
      <div className="py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 text-white">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              ABOUT THE IMO STATE STUDENT GRANT
            </h1>
            <p className="text-lg md:text-xl">Empowering tomorrow's leaders today</p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-imogreen">Our Mission</h2>
              <p className="mb-4">
                The Imo State Government Student Grant program was established to provide financial assistance to deserving students 
                from Imo State studying in various higher institutions across Nigeria.
              </p>
              <p className="mb-4">
                Our goal is to reduce the financial burden on students and their families, enabling them to focus on their 
                academic pursuits without the distraction of financial constraints.
              </p>
              <p>
                The grant ranges from ₦20,000 to ₦100,000 based on need assessment and is awarded to students across 
                various disciplines and levels of study.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-imogreen">Eligibility Criteria</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Must be an indigene of Imo State</li>
                <li>Must be a full-time student in a recognized higher institution</li>
                <li>Must maintain a minimum CGPA of 2.5 or equivalent</li>
                <li>Must demonstrate financial need</li>
                <li>Must not be a recipient of any other government scholarship or grant</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-imogreen">Success Stories</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <Testimonial 
                  key={index}
                  name={testimonial.name}
                  school={testimonial.school}
                  level={testimonial.level}
                  testimonial={testimonial.testimonial}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button className="bg-imogreen hover:bg-imogreen-dark text-white" asChild>
                <Link to="/">Apply for Grant</Link>
              </Button>
            </div>
          </div>

          <div className="text-center text-white">
            <p className="italic text-sm">
              "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
            </p>
            <p className="mt-4 text-sm">
              For inquiries, contact the Imo State Ministry of Education at education@imostate.gov.ng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
