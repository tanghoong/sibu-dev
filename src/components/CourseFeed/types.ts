// types.ts

export interface Course {
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
  
  export interface Chapter {
    time: string;
    title: string;
    description: string;
  }
  
  export interface CourseFeedByAPIProps {
    apiUrl: string;
  }