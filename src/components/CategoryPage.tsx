import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contentManager, Course } from '../utils/contentManager';
import ReactMarkdown from 'react-markdown';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      await contentManager.init();
      setCourses(contentManager.getByCategory(category || ''));
      setIsLoading(false);
    };

    loadCourses();
  }, [category]);

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div>
      <h1>Courses in {category}</h1>
      {courses.map(course => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>Date: {new Date(course.datetime).toLocaleDateString()}</p>
          <ReactMarkdown>{course.content.slice(0, 150)}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;