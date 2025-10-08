import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchArticles } from '../api';

// Mock setTimeout to control delays in tests
vi.mock('setTimeout', () => ({
  default: (callback: () => void) => callback()
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset random to ensure consistent test behavior
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  it('returns search results with correct structure', async () => {
    const result = await searchArticles('test query', 1);

    expect(result).toEqual({
      data: expect.any(Array),
      page: 1,
      pageSize: 10,
      total: 30
    });

    expect(result.data).toHaveLength(10);
    expect(result.data[0]).toEqual({
      id: expect.any(Number),
      title: expect.any(String),
      summary: expect.any(String)
    });
  });

  it('includes query in article titles when provided', async () => {
    const query = 'React';
    const result = await searchArticles(query, 1);

    result.data.forEach(article => {
      expect(article.title).toContain(query);
    });
  });

  it('generates different article IDs for different pages', async () => {
    const page1Result = await searchArticles('test', 1);
    const page2Result = await searchArticles('test', 2);

    const page1Ids = page1Result.data.map(article => article.id);
    const page2Ids = page2Result.data.map(article => article.id);

    // Ensure no overlapping IDs between pages
    const intersection = page1Ids.filter(id => page2Ids.includes(id));
    expect(intersection).toHaveLength(0);
  });

  it('respects total count limit', async () => {
    // Test page that would exceed total count (total is 30, so page 4+ should have no results)
    const result = await searchArticles('test', 4); // Page 4 * 10 = 40, which exceeds total of 30

    expect(result.data).toHaveLength(0);
    expect(result.page).toBe(4);
    expect(result.total).toBe(30);
  });

  it('returns empty results for xyz123 query', async () => {
    const result = await searchArticles('xyz123', 1);

    expect(result).toEqual({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0
    });
  });

  it('throws error when random number triggers failure', async () => {
    // Mock random to return a value that triggers error (< 0.05)
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    await expect(searchArticles('test', 1)).rejects.toThrow('Network error: Failed to fetch articles');
  });

  it('generates articles with expected content structure', async () => {
    const result = await searchArticles('TypeScript', 1);
    const article = result.data[0];

    expect(article.title).toMatch(/TypeScript - Article \d+: Advanced Techniques/);
    expect(article.summary).toContain('TypeScript');
    expect(article.summary).toContain('comprehensive summary');
    expect(article.summary).toContain('implementation details');
  });

  it('handles empty query gracefully', async () => {
    const result = await searchArticles('', 1);

    expect(result.data).toHaveLength(10);
    result.data.forEach(article => {
      expect(article.title).toMatch(/Article \d+: Advanced Techniques/);
      expect(article.summary).toContain('technology');
    });
  });

  it('filters articles beyond total count correctly', async () => {
    // Test a page that would exceed the 30 total limit
    const result = await searchArticles('test', 4); // Would generate IDs 31-40, but total is 30

    // Should return empty array since all IDs exceed the total count
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(30);
  });

  it('maintains consistent pageSize regardless of query', async () => {
    const results = await Promise.all([
      searchArticles('React', 1),
      searchArticles('Vue', 1),
      searchArticles('Angular', 1)
    ]);

    results.forEach(result => {
      expect(result.pageSize).toBe(10);
    });
  });

  it('case insensitive special query handling', async () => {
    const lowerResult = await searchArticles('xyz123', 1);
    const upperResult = await searchArticles('XYZ123', 1);
    const mixedResult = await searchArticles('XyZ123', 1);

    expect(lowerResult.data).toHaveLength(0);
    expect(upperResult.data).toHaveLength(0);
    expect(mixedResult.data).toHaveLength(0);
  });
});