// subcomponents.tsx

import React from 'react';
import { Bookmark, Share2, ThumbsUp, Eye, Clock, Calendar, X } from 'lucide-react';
import { Course, Chapter } from './types';
import { formatDuration, formatDate, formatViews } from './utils';

interface CourseCardProps {
  course: Course;
  isBookmarked: boolean;
  onWatch: (course: Course) => void;
  onBookmark: (videoId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isBookmarked, onWatch, onBookmark }) => (
  <div className="flex-shrink-0 w-64">
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(course.length)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-gray-600 mb-1">{course.channel_name}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatViews(course.views)} views</span>
          <span>{formatDate(course.upload_date)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => onWatch(course)}
            className="bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition duration-300"
          >
            Watch
          </button>
          <button
            onClick={() => onBookmark(course.video_id)}
            className={`${
              isBookmarked ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 transition duration-300`}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface InlineVideoProps {
  course: Course;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmark: (videoId: string) => void;
  activeTab: 'actions' | 'comments' | 'info';
  setActiveTab: (tab: 'actions' | 'comments' | 'info') => void;
  chapters: Chapter[];
}

export const InlineVideo: React.FC<InlineVideoProps> = ({ 
  course, onClose, isBookmarked, onBookmark, activeTab, setActiveTab, chapters 
}) => (
  <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
    <div className="flex flex-col md:flex-row h-full">
      <div className="md:w-2/3 h-full relative">
        <button onClick={onClose} className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2">
          <X size={24} />
        </button>
        <div className="aspect-w-16 aspect-h-9 h-full">
          <iframe
            src={`https://www.youtube.com/embed/${course.video_id}?autoplay=1&rel=0&modestbranding=1&controls=0&showinfo=0`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={course.title}
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
      <div className="md:w-1/3 p-4 flex flex-col h-full overflow-y-auto">
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2 ${activeTab === 'actions' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Actions
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-2 ${activeTab === 'comments' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 ${activeTab === 'info' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Info
          </button>
        </div>
        {activeTab === 'actions' && (
          <div id="actions-tab" className="flex-grow">
            <div className="flex justify-around p-2 bg-gray-100 rounded-lg mb-4">
              <button 
                onClick={() => onBookmark(course.video_id)}
                className={`${
                  isBookmarked ? 'text-red-500' : 'text-gray-600'
                } hover:text-red-500`}
              >
                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button className="text-gray-600 hover:text-green-500">
                <Share2 size={20} />
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                <ThumbsUp size={20} />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Chapters</h3>
              {chapters.map((chapter, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{chapter.time}</span>
                    <span className="text-sm font-semibold">{chapter.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{chapter.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'comments' && (
          <div id="comments-tab" className="flex-grow">
            <p className="text-sm">Comments section placeholder</p>
          </div>
        )}
        {activeTab === 'info' && (
          <div id="info-tab" className="flex-grow">
            <h2 className="text-lg font-bold mb-2">{course.title}</h2>
            <a href={`https://www.youtube.com/channel/${course.channel_id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mb-2 block">
              {course.channel_name}
            </a>
            <div className="flex flex-wrap justify-between text-xs text-gray-500 mb-2">
              <span className="flex items-center mb-1"><Eye size={14} className="mr-1" /> {formatViews(course.views)}</span>
              <span className="flex items-center mb-1"><ThumbsUp size={14} className="mr-1" /> {course.likes}</span>
              <span className="flex items-center mb-1"><Clock size={14} className="mr-1" /> {formatDuration(course.length)}</span>
              <span className="flex items-center mb-1"><Calendar size={14} className="mr-1" /> {formatDate(course.upload_date)}</span>
            </div>
            <p className="text-xs text-gray-700 whitespace-pre-wrap">{course.description}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);