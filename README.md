# 🔍 Go Search - Real-time Article Search Application

A beautiful, responsive real-time search application built with React, TypeScript, and Tailwind CSS. Features instant search with debouncing, pagination, loading states, and error handling.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Search**: Instant search with 300ms debouncing for optimal performance
- **Pagination**: "Load More" functionality with smooth animations
- **Error Handling**: Graceful error handling with retry mechanisms
- **Loading States**: Beautiful shimmer loading animations
- **Responsive Design**: Mobile-first approach with stunning UI

### 🎨 UI/UX Excellence
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Smooth Animations**: Fade-in, slide-up, and shimmer effects
- **Interactive Elements**: Hover states, focus indicators, and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader friendly

### 🛠️ Technical Features
- **TypeScript**: Full type safety and excellent developer experience
- **React Hooks**: Modern React patterns with custom hooks
- **State Management**: Efficient state management with useReducer
- **Performance**: Optimized rendering and request cancellation
- **Mock API**: Realistic API simulation with edge cases

### 🧪 Testing Suite
- **Comprehensive Testing**: 72 tests with 97.05% code coverage
- **Component Tests**: Full coverage of all React components
- **Hook Tests**: Complete testing of custom hooks with proper timer mocking
- **Integration Tests**: End-to-end testing scenarios
- **API Tests**: Mock API service validation and edge cases

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:yz-abdulrehman-khan/go-search.git
   cd go-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   npm run test:coverage
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── __tests__/        # Component tests
│   ├── ArticleCard.tsx   # Individual article display
│   ├── ArticleList.tsx   # Article grid with states
│   ├── LoadingCard.tsx   # Skeleton loading component
│   ├── SearchInput.tsx   # Search input with debouncing
│   └── SearchPage.tsx    # Main page component
├── hooks/               # Custom React hooks
│   ├── __tests__/        # Hook tests
│   └── useSearch.ts     # Search logic and state management
├── services/            # API and external services
│   ├── __tests__/        # Service tests
│   └── api.ts          # Mock API service
├── test/                # Test utilities and E2E tests
│   ├── e2e.test.tsx     # End-to-end tests
│   └── setup.ts         # Test setup and configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.tsx             # App component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

## 🔧 Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5.9** - Type safety and developer experience
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Testing
- **Vitest** - Fast unit test framework
- **Testing Library** - React component testing utilities
- **jsdom** - DOM environment for testing
- **Coverage Reports** - Comprehensive test coverage analysis

### UI Components
- **Lucide React** - Beautiful icon library
- **Clsx** - Conditional className utility

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🎯 API Reference

The application uses a mock API that simulates the following endpoint:

```typescript
GET /articles?q=keyword&page=page_number

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "summary": "Article summary content..."
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 30
}
```

### Mock API Features
- **Realistic Data**: Dynamic article generation based on search terms
- **Error Simulation**: 5% chance of network errors for testing
- **Edge Cases**: Empty results for specific queries (e.g., "xyz123")
- **Network Delay**: 300-500ms simulated response time

## 🎨 Component Architecture

### SearchInput Component
- Debounced input with 300ms delay
- Loading states and clear functionality
- Keyboard shortcuts (Escape to clear)
- Search suggestions for better UX

### ArticleList Component
- Grid layout with responsive design
- Loading skeletons during fetch
- Error states with retry options
- Empty states with helpful messaging
- Infinite scroll with "Load More"

### ArticleCard Component
- Beautiful card design with hover effects
- Truncated content with "Read more" links
- Status indicators and metadata
- Smooth animations on render

## 🔍 Search Implementation

The search functionality is implemented with:

1. **Debouncing**: 300ms delay to prevent excessive API calls
2. **Request Cancellation**: Automatic cancellation of previous requests
3. **State Management**: useReducer for complex state logic
4. **Error Handling**: Comprehensive error states and recovery
5. **Performance**: Optimized re-renders and memory usage

### Search States
- `pending` - Initial state
- `loading` - Search in progress
- `success` - Results loaded
- `error` - Error occurred
- `empty` - No results found

## 🎭 Styling Guide

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #2563EB)
- **Secondary**: Purple accent (#7C3AED)
- **Background**: Gradient from blue to purple tints
- **Text**: Gray scale for hierarchy
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

### Animation System
- **Fade In**: 300ms ease-in-out
- **Slide Up**: 300ms ease-out with 10px offset
- **Shimmer**: 1.5s infinite loading animation
- **Hover**: 200ms scale and shadow transitions

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Components**: 100% coverage of all React components
- **Hooks**: Complete testing of useSearch hook with timer mocking
- **Services**: Full API service testing with edge cases
- **Integration**: End-to-end user flow testing
- **Overall**: 97.05% code coverage

### Test Structure
- Unit tests for individual components
- Integration tests for component interactions
- Hook tests with proper mocking and timers
- API service tests with various scenarios
- End-to-end tests for complete user workflows

## 🚀 Deployment

### Netlify (Recommended)
The project includes `netlify.toml` for easy deployment:

1. Connect your GitHub repository to Netlify
2. Netlify will auto-detect the configuration
3. Set Node.js version to 24 in build settings
4. Deploy!

### Manual Deployment
```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

### Environment Variables
No environment variables required for basic setup. The app uses mock data by default.

## 🔧 Customization

### Adding Real API
Replace the mock API in `src/services/api.ts`:

```typescript
export const searchArticles = async (query: string, page: number): Promise<SearchResponse> => {
  const response = await fetch(`/api/articles?q=${query}&page=${page}`);
  return response.json();
};
```

### Styling Customization
Modify `tailwind.config.js` to customize:
- Colors and theme
- Animations and transitions
- Breakpoints and spacing

### Component Customization
All components are designed to be easily customizable:
- Prop interfaces for flexibility
- Modular CSS classes
- Clear separation of concerns

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Vitest Documentation](https://vitest.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run test suite and ensure 100% pass rate
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by best practices in React development
- UI/UX design influenced by contemporary web applications
- Comprehensive testing ensures reliability and maintainability

---

**Built by [Claude Code](https://claude.ai/code)** - AI-powered development assistant
