// CourseFeedByAPI.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Course, Chapter, CourseFeedByAPIProps } from './types';
import { CourseCard, InlineVideo } from './subcomponents';

const CourseFeedByAPI: React.FC<CourseFeedByAPIProps> = ({ apiUrl }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'oldest' | 'popular'>('latest');
  const [activeTab, setActiveTab] = useState<'actions' | 'comments' | 'info'>('actions');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>(apiUrl);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Generate dummy chapters
    const dummyChapters = Array.from({ length: 5 }, (_, i) => ({
      time: `${String(i * 5).padStart(2, '0')}:00`,
      title: `Chapter ${i + 1}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }));
    setChapters(dummyChapters);

    return () => window.removeEventListener('resize', handleResize);
  }, [apiUrl]);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const sortedCourses = useCallback(() => {
    switch (sortOption) {
      case 'latest':
        return [...courses].sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
      case 'oldest':
        return [...courses].sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
      case 'popular':
        return [...courses].sort((a, b) => parseInt(b.views) - parseInt(a.views));
      default:
        return courses;
    }
  }, [courses, sortOption]);

  const handlePrev = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -containerRef.current.offsetWidth, behavior: 'smooth' });
    }
  }, []);

  const handleNext = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: containerRef.current.offsetWidth, behavior: 'smooth' });
    }
  }, []);

  const handleWatch = useCallback((course: Course) => {
    setSelectedCourse(course);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseInline = useCallback(() => {
    setSelectedCourse(null);
    document.body.style.overflow = 'auto';
  }, []);

  const handleBookmark = useCallback((videoId: string) => {
    setBookmarkedCourses(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  }, []);

  if (loading) return <div className="text-center py-4">Loading courses...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'latest' | 'oldest' | 'popular')}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
        {!isMobile && (
          <div className="flex space-x-4">
            <button
              onClick={handlePrev}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
      <div 
        className={`relative overflow-x-auto ${isMobile ? 'overflow-x-scroll' : 'overflow-x-hidden'}`}
        ref={containerRef}
      >
        <div className="flex space-x-4">
          {sortedCourses().map((course) => (
            <CourseCard
              key={course.video_id}
              course={course}
              isBookmarked={bookmarkedCourses.includes(course.video_id)}
              onWatch={handleWatch}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      </div>
      {selectedCourse && (
        <InlineVideo
          course={selectedCourse}
          onClose={handleCloseInline}
          isBookmarked={bookmarkedCourses.includes(selectedCourse.video_id)}
          onBookmark={handleBookmark}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chapters={chapters}
        />
      )}
    </div>
  );
};

export default CourseFeedByAPI;