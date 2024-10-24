'use client';

import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FiSun, FiMoon } from 'react-icons/fi'; 

const ThemeSwitcher: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex items-center space-x-2">
 
      <div className="text-yellow-500 dark:text-gray-400">
        {isDarkMode ? <FiMoon size={24} /> : <FiSun size={24} />}
      </div>
      
      <Switch checked={isDarkMode} onCheckedChange={toggleTheme} id="theme-switcher" />
      <Label htmlFor="theme-switcher" className="text-gray-700 dark:text-gray-300">
       
      </Label>
    </div>
  );
};

export default ThemeSwitcher;
