import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contentManager, Course } from '../utils/contentManager';
import ReactMarkdown from 'react-markdown';

const ContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      await contentManager.init();
      const allCourses = contentManager.getAll();
      const foundCourse = allCourses.find(c => c.id === id);
      setCourse(foundCourse || null);
      setIsLoading(false);
    };

    loadCourse();
  }, [id]);

  if (isLoading) {
    return <div>Loading course...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        Category: {course.category} | Date: {new Date(course.datetime).toLocaleDateString()}
      </p>
      <div className="prose max-w-none">
        <ReactMarkdown>{course.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ContentPage;