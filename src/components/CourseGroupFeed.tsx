import React from 'react';
import CourseFeedByAPI from './CourseFeed/CourseFeedByAPI';
import { courseGroups, CourseGroup } from '../config/listConfig';

const CourseGroupFeed: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Course Groups</h1>
      {courseGroups.map((group: CourseGroup) => (
        <div key={group.groupId} className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 px-6">{group.groupTitle}</h2>
          <p className="text-gray-600 mb-6 px-6">{group.shortDesc}</p>
          <CourseFeedByAPI 
            apiUrl={`https://youtube-playlist-api-kamfu-dev.replit.app/playlist/${group.playlistId}?cover_size=high`}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseGroupFeed;