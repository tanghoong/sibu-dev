// src/utils/contentManager.ts

export interface Course {
  id: string;
  datetime: string;
  title: string;
  category: string;
  content: string;
}

export interface CategoryCourses {
  category: string;
  courses: Course[];
}

class ContentManager {
  private categoryCourses: CategoryCourses[] = [];
  public debugInfo: string[] = [];

  async init() {
    this.debugInfo = []; // Clear previous debug info
    this.categoryCourses = []; // Clear existing courses
    
    const globPattern = '../content/**/*.md';
    this.debugInfo.push(`Searching for files with pattern: ${globPattern}`);
    
    const markdownFiles = import.meta.glob<string>('../content/**/*.md', { as: 'raw', eager: true });

    this.debugInfo.push(`Found ${Object.keys(markdownFiles).length} markdown files.`);

    Object.entries(markdownFiles).forEach(([filepath, content]) => {
      try {
        const pathParts = filepath.split('/');
        const filename = pathParts[pathParts.length - 1];
        const category = pathParts[pathParts.length - 2];
        
        // Parse filename based on the format: id.YYYYMMDDhhmmss.Title.md
        const [id, datetimeStr, ...titleParts] = filename.replace('.md', '').split('.');
        const title = titleParts.join('.');
        
        // Convert datetime string to a proper date format
        const datetime = `${datetimeStr.slice(0,4)}-${datetimeStr.slice(4,6)}-${datetimeStr.slice(6,8)}T${datetimeStr.slice(8,10)}:${datetimeStr.slice(10,12)}:${datetimeStr.slice(12,14)}Z`;

        this.debugInfo.push(`Processed file: ${filepath}`);
        this.debugInfo.push(`- ID: ${id}, Title: ${title}, Category: ${category}`);
        this.debugInfo.push(`- Datetime: ${datetime}`);
        this.debugInfo.push(`- Content length: ${content.length} characters`);

        const course: Course = {
          id,
          datetime,
          title,
          category,
          content,
        };

        const categoryIndex = this.categoryCourses.findIndex(cc => cc.category === category);
        if (categoryIndex === -1) {
          this.categoryCourses.push({ category, courses: [course] });
        } else {
          this.categoryCourses[categoryIndex].courses.push(course);
        }
      } catch (error) {
        this.debugInfo.push(`Error processing file ${filepath}: ${error}`);
      }
    });

    // Sort courses within each category by ID in ascending order
    this.categoryCourses.forEach(categoryCourse => {
      categoryCourse.courses.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    });

    this.debugInfo.push(`Processed ${this.categoryCourses.length} categories.`);
    this.categoryCourses.forEach(categoryCourse => {
      this.debugInfo.push(`- ${categoryCourse.category}: ${categoryCourse.courses.length} courses`);
    });
  }

  getAllCategories(): CategoryCourses[] {
    return this.categoryCourses;
  }

  getDebugInfo(): string[] {
    return this.debugInfo;
  }
}

export const contentManager = new ContentManager();