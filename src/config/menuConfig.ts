// src/config/menuConfig.ts

import { HomeIcon, FolderIcon, MapIcon, BookmarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export const siteInfo = {
  icon: BookOpenIcon,
  title: 'Sibu.dev',
  slogan: 'Open Self-Learning Platform'
};

export const navbarMenuItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Categories', href: '/categories', icon: FolderIcon },
  { name: 'Roadmap', href: '/roadmap', icon: MapIcon },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
];

export const sidebarItems = [
  {
    title: 'Bookmarks',
    icon: BookmarkIcon,
    items: [] // This will be populated dynamically
  },
  { 
    title: 'Categories', 
    icon: FolderIcon,
    items: [
      { name: 'Web Development', href: '/categories/web-development' },
      { name: 'Mobile Development', href: '/categories/mobile-development' },
      { name: 'Data Science', href: '/categories/data-science' },
      { name: 'Machine Learning', href: '/categories/machine-learning' },
    ]
  },
  {
    title: 'Roadmaps',
    icon: MapIcon,
    items: [
      { name: 'Frontend Developer', href: '/roadmaps/frontend' },
      { name: 'Backend Developer', href: '/roadmaps/backend' },
      { name: 'Full Stack Developer', href: '/roadmaps/fullstack' },
      { name: 'DevOps Engineer', href: '/roadmaps/devops' },
    ]
  },
];