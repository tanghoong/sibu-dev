import React from 'react';
import { Link } from 'react-router-dom';
import { navbarMenuItems, siteInfo } from '../config/menuConfig';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <siteInfo.icon className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-lg sm:text-xl font-bold">{siteInfo.title}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            {navbarMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center text-base text-black hover:text-blue-500"
              >
                <item.icon className="h-5 w-5 mr-1" />
                {item.name}
              </Link>
            ))}
          </div>
          <button
            className="sm:hidden text-black"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;