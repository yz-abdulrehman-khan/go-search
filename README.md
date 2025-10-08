# 🔍 Go Search - Real-time Article Search Application

A beautiful, responsive real-time search application built with React, TypeScript, and Tailwind CSS. Features instant search with debouncing, pagination, loading states, and comprehensive testing.

## ✨ Features

- **Real-time Search**: Instant search with 300ms debouncing
- **Pagination**: "Load More" functionality with smooth animations
- **Error Handling**: Graceful error handling with retry mechanisms
- **Loading States**: Beautiful shimmer loading animations
- **Responsive Design**: Mobile-first approach with modern UI
- **TypeScript**: Full type safety and excellent developer experience
- **Comprehensive Testing**: 72 tests with 97.05% code coverage

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:yz-abdulrehman-khan/go-search.git
cd go-search

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
npm run test:coverage
```

Open `http://localhost:5173` in your browser.

## 🏗️ Project Structure

```
src/
├── components/           # React components + tests
├── hooks/               # Custom React hooks + tests
├── services/            # API services + tests
├── test/                # E2E tests and setup
├── types/              # TypeScript definitions
└── index.css          # Global styles
```

## 🔧 Technology Stack

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Tailwind CSS 3.4** for styling
- **Vitest** + **Testing Library** for testing
- **Lucide React** for icons

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:coverage # Run with coverage report
npm run test:watch    # Watch mode
```

**Coverage**: 97.05% with 72 passing tests across components, hooks, services, and E2E scenarios.

## 🚀 Deployment

### Netlify (Recommended)
1. Connect GitHub repo to [Netlify](https://netlify.com)
2. Auto-deploys on push with these settings:
   - Build: `npm run build`
   - Publish: `dist`

### Manual
```bash
npm run build    # Creates dist/ folder
# Upload dist/ to any static hosting
```

### Other Options
- **Vercel**: Import GitHub repo
- **GitHub Pages**: Enable in repository settings
- **Railway/Render**: Connect repo for auto-deploy

## 🎯 API Reference

Mock API simulates:
```typescript
GET /articles?q=keyword&page=1
// Returns: { data: Article[], page: 1, pageSize: 10, total: 30 }
```

## 🔧 Customization

Replace mock API in `src/services/api.ts`:
```typescript
export const searchArticles = async (query: string, page: number) => {
  const response = await fetch(`/api/articles?q=${query}&page=${page}`);
  return response.json();
};
```

## 📄 License

MIT License - Open source and free to use.

---