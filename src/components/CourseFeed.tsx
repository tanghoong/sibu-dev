import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { contentManager, CategoryCourses, Course } from '../utils/contentManager';

const CourseThumbnail: React.FC<{ course: Course }> = ({ course }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-2">
        Date: {new Date(course.datetime).toLocaleDateString()}
      </p>
      <div className="prose max-w-none mb-4">
        <ReactMarkdown>{course.content.slice(0, 100)}</ReactMarkdown>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Watch Video
      </button>
    </div>
  </div>
);

const CourseFeed: React.FC = () => {
  const [categories, setCategories] = useState<CategoryCourses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      await contentManager.init();
      const allCategories = contentManager.getAllCategories();
      setCategories(allCategories);
      setDebugInfo(contentManager.getDebugInfo());
      setIsLoading(false);
    };

    loadCourses();
  }, []);

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Course Feed</h1>
      
      {/* Debug Information */}
      <div className="bg-gray-100 p-4 mb-8 rounded">
        <h2 className="text-xl font-bold mb-2">Debug Information</h2>
        <pre className="whitespace-pre-wrap">
          {debugInfo.join('\n')}
        </pre>
      </div>

      {/* Course List */}
      {categories.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-left">{category.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.courses.map((course) => (
              <CourseThumbnail key={`${category.category}-${course.id}`} course={course} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseFeed;