
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-imogreen-dark py-3 px-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="font-bold text-white text-lg">Imo State Grants</div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-200">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
