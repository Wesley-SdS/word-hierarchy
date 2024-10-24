'use client';
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 p-12 rounded-lg shadow-lg text-center">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <h1 className="text-4xl lg:text-5xl font-bold text-white dark:text-gray-100">
        Word Hierarchy Builder
      </h1>
      <p className="mt-6 text-lg lg:text-xl text-gray-200 dark:text-gray-300">
        Create and manage your word hierarchies effortlessly.
      </p>
    </div>
  );
};

export default Hero;
