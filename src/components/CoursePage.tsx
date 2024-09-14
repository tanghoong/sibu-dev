import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ContentItem } from "../types/content";
import { contentManager } from "../utils/contentManager";

const CoursePage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentItems = async () => {
      try {
        setError(null);
        const items = contentManager.getByCategory(category);
        setContentItems(items);
      } catch (error) {
        console.error("Error fetching content items:", error);
        setError("Failed to fetch content items.");
      }
    };

    fetchContentItems();
  }, [category]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="prose prose-lg dark:prose-dark mx-auto py-8">
      <h1>Category: {category}</h1>
      <ul>
        {contentItems.map((item) => (
          <li key={item.id}>
            <Link to={`/categories/${item.category}/${item.id}`}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursePage;
