// config/listConfig.ts

export interface CourseGroup {
    groupId: number;
    groupTitle: string;
    playlistId: string;
    shortDesc: string;
  }
  
  export const courseGroups: CourseGroup[] = [
    {
      groupId: 1,
      groupTitle: "AI Introduction",
      playlistId: "PL-vJAaT0bOQmAnSjW_xIMiNddaV3haYTJ",
      shortDesc: "An introduction to Artificial Intelligence concepts and applications."
    },
    {
      groupId: 2,
      groupTitle: "Machine Learning Basics",
      playlistId: "PL1OxOoszq6VT0mKl_M56XeJdbtCEvBKqc",
      shortDesc: "Fundamental concepts and techniques in Machine Learning."
    },
    // Add more course groups as needed
  ];