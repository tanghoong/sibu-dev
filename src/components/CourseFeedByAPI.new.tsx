import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, X, Bookmark, Share2, ThumbsUp, Eye, Clock, Calendar, MessageSquare, Info } from 'lucide-react';

interface Course {
  channel_id: string;
  channel_name: string;
  description: string;
  length: string;
  likes: string;
  thumbnail: string;
  title: string;
  upload_date: string;
  video_id: string;
  views: string;
}

interface CourseFeedByAPIProps {
  apiUrl: string;
}

const CourseFeedByAPI: React.FC<CourseFeedByAPIProps> = ({ apiUrl }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [playVideo, setPlayVideo] = useState<boolean>(false);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'oldest' | 'popular'>('latest');
  const [activeTab, setActiveTab] = useState<'actions' | 'comments' | 'info'>('actions');
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
    setPlayVideo(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseInline = useCallback(() => {
    setSelectedCourse(null);
    setPlayVideo(false);
    document.body.style.overflow = 'auto';
  }, []);

  const handleBookmark = useCallback((videoId: string) => {
    setBookmarkedCourses(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  }, []);

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match?.[1] ? parseInt(match[1].slice(0, -1)) : 0;
    const minutes = match?.[2] ? parseInt(match[2].slice(0, -1)) : 0;
    const seconds = match?.[3] ? parseInt(match[3].slice(0, -1)) : 0;
    
    return `${hours ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const formatViews = (views: string): string => {
    const viewCount = parseInt(views);
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`;
    }
    return views;
  };

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
            <div key={course.video_id} className="flex-shrink-0 w-64">
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
                      onClick={() => handleWatch(course)}
                      className="bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition duration-300"
                    >
                      Watch
                    </button>
                    <button
                      onClick={() => handleBookmark(course.video_id)}
                      className={`${
                        bookmarkedCourses.includes(course.video_id) ? 'text-red-500' : 'text-gray-400'
                      } hover:text-red-500 transition duration-300`}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCourse && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-2/3 h-full relative">
              <button onClick={handleCloseInline} className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2">
                <X size={24} />
              </button>
              <div className="aspect-w-16 aspect-h-9 h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedCourse.video_id}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={selectedCourse.title}
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            <div className="md:w-1/3 p-6 flex flex-col h-full overflow-y-auto">
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
                  <div className="flex justify-around p-4 bg-gray-100 rounded-lg">
                    <button 
                      onClick={() => handleBookmark(selectedCourse.video_id)}
                      className={`${
                        bookmarkedCourses.includes(selectedCourse.video_id) ? 'text-red-500' : 'text-gray-600'
                      } hover:text-red-500`}
                    >
                      <Bookmark size={24} />
                    </button>
                    <button className="text-gray-600 hover:text-green-500">
                      <Share2 size={24} />
                    </button>
                    <button className="text-gray-600 hover:text-blue-500">
                      <ThumbsUp size={24} />
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'comments' && (
                <div id="comments-tab" className="flex-grow">
                  <p>Comments section placeholder</p>
                </div>
              )}
              {activeTab === 'info' && (
                <div id="info-tab" className="flex-grow">
                  <h2 className="text-xl font-bold mb-2">{selectedCourse.title}</h2>
                  <a href={`https://www.youtube.com/channel/${selectedCourse.channel_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-4 block">
                    {selectedCourse.channel_name}
                  </a>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center"><Eye size={16} className="mr-1" /> {formatViews(selectedCourse.views)} views</span>
                    <span className="flex items-center"><ThumbsUp size={16} className="mr-1" /> {selectedCourse.likes} likes</span>
                    <span className="flex items-center"><Clock size={16} className="mr-1" /> {formatDuration(selectedCourse.length)}</span>
                    <span className="flex items-center"><Calendar size={16} className="mr-1" /> {formatDate(selectedCourse.upload_date)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCourse.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFeedByAPI;