import React from 'react';
import { FaGithub, FaLinkedin, FaHome, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 dark:bg-gray-800 dark:text-gray-300">
      <div className="container mx-auto flex flex-col items-center space-y-4">

        {/* Interactive Menu */}
        <nav className="flex space-x-8 mb-4">
          <Link href="/" className="group flex items-center space-x-2 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white transition-transform duration-300">
            <FaHome size={20} />
            <span className="relative">
              Home
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </Link>
          <Link href="/documentation" className="group flex items-center space-x-2 text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white transition-transform duration-300">
            <FaFileAlt size={20} />
            <span className="relative">
              Documentation
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </Link>
        </nav>

        <div className="w-full border-t border-violet-700 mb-4 dark:border-violet-600"></div>

        <p className="text-sm mb-2">&copy; 2024 Word Hierarchy Project. All rights reserved.</p>

        <div className="flex space-x-6 mb-2">
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
