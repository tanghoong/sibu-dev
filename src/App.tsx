import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoryPage from './components/CategoryPage';
import ContentPage from './components/ContentPage';
import CoursePage from './components/CoursePage';
import CourseFeed from './components/CourseFeed';
import CourseGroupFeed from './components/CourseGroupFeed';
import { sidebarItems, siteInfo } from './config/menuConfig';
import { XMarkIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
        )}
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full bg-white overflow-y-auto transition-all duration-300 shadow-lg z-50 ${sidebarOpen ? (isMobile ? 'w-full' : 'w-64') : 'w-0'}`}>
          <div className="p-4">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            {sidebarItems.map((section) => (
              <details key={section.title} className="mb-4">
                <summary className="flex items-center cursor-pointer justify-between text-lg font-medium">
                  <div className="flex items-center">
                    <section.icon className="h-5 w-5 mr-2" />
                    <span>{section.title}</span>
                  </div>
                </summary>
                <ul className="mt-2 ml-7 space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="block py-1 text-base hover:text-blue-500"
                        onClick={toggleSidebar}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<><HeroSlider /><CourseFeed /></>} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/categories/:category" element={<CoursePage />} />
            <Route path="/categories/:category/:id" element={<ContentPage />} />
            <Route path="/roadmaps/:roadmap" element={<CoursePage />} />
            <Route path="/bookmarks" element={<CourseFeed />} />
          </Routes>
        </main>
      </div>
      <CourseGroupFeed />
      <footer className="bg-gray-100 text-center py-6 sm:py-8">
        <p className="text-sm sm:text-base text-gray-500 mb-2">{siteInfo.slogan}</p>
        <p className="text-xs sm:text-sm">&copy; 2024 Sibu.dev. All rights reserved. This is an open self-learning platform.</p>
      </footer>
    </div>
  );
};

export default App;