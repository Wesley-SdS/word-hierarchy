import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gray-200 p-8 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-semibold text-gray-800">Word Hierarchy Builder</h1>
      <p className="mt-4 text-gray-600">
        Create and manage your word hierarchies effortlessly.
      </p>
    </div>
  );
};

export default Hero;
