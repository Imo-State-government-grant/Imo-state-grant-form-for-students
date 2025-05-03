
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestimonialProps {
  name: string;
  school: string;
  level: string;
  testimonial: string;
}

const Testimonial = ({ name, school, level, testimonial }: TestimonialProps) => {
  return (
    <Card className="mb-6 border-t-4 border-t-imogreen shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{school} - {level}</p>
      </CardHeader>
      <CardContent>
        <p className="italic">"{testimonial}"</p>
      </CardContent>
    </Card>
  );
};

export default Testimonial;
