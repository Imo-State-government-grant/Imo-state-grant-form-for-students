
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-white py-2 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="font-bold text-black text-lg">Imo State Grants</div>
        <div className="space-x-4">
          <Link to="/" className="text-black hover:text-gray-600">Home</Link>
          <Link to="/about" className="text-black hover:text-gray-600">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
