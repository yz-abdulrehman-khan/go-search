import type { SearchResponse } from '../types/index';

// Mock data generator
const generateMockArticles = (page: number, pageSize: number, query: string): SearchResponse => {
  const total = 30;
  const startId = (page - 1) * pageSize + 1;

  const mockData = Array.from({ length: pageSize }, (_, index) => ({
    id: startId + index,
    
    title: `${query ? `${query} - ` : ''}Article ${startId + index}: Advanced Techniques`,
    summary: `This is a comprehensive summary of article ${startId + index} about ${query || 'technology'}. It covers various aspects including implementation details, best practices, and real-world applications. The content is designed to be informative and engaging for readers interested in learning more about this topic.`
  }));

  // Filter out articles beyond total count
  const validArticles = mockData.filter(article => article.id <= total);

  return {
    data: validArticles,
    page,
    pageSize,
    total
  };
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchArticles = async (query: string, page: number = 1): Promise<SearchResponse> => {
  // Simulate network delay
  await delay(300 + Math.random() * 200);

  // Simulate occasional network errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error: Failed to fetch articles');
  }

  // Simulate empty results for certain queries
  if (query.toLowerCase().includes('xyz123')) {
    return {
      data: [],
      page,
      pageSize: 10,
      total: 0
    };
  }

  return generateMockArticles(page, 10, query);
};