import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 dark:bg-gray-800 dark:text-gray-300">
      <div className="container mx-auto flex flex-col items-center">

        <div className="w-full border-t border-gray-700 mb-6 dark:border-gray-600"></div>

        <p className="text-sm mb-4">&copy; 2024 Word Hierarchy Project. All rights reserved.</p>

        <div className="flex space-x-6 mb-4">
          <a
            href="https://github.com/Wesley-SdS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-300 dark:text-gray-400 dark:hover:text-white"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/wesley-sds/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-300 dark:text-gray-400 dark:hover:text-white"
          >
            <FaLinkedin size={28} />
          </a>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Developed by <span className="text-white font-semibold dark:text-white">Wesley Santos</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
