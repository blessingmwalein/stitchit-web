# StitchIt Web - Tufted Rugs Zimbabwe

A modern web application for showcasing and ordering handcrafted tufted rugs.

## Features

- **Home Page**: Featured rugs, recent creations, and use cases with API integration
- **Gallery**: Browse all rugs with advanced filtering and search
- **Product Details**: Detailed view of individual rugs
- **Order System**: Custom rug ordering with specifications
- **User Dashboard**: Order tracking and profile management
- **Responsive Design**: Mobile-first approach with modern UI

## API Integration

The application integrates with the Tufted Rugs Zimbabwe API for real-time data:

### API Endpoints Used

- `GET /api/client/finished-products` - Get all finished products with pagination and filtering
- `GET /api/client/finished-products/grouped` - Get products grouped by use case
- `GET /api/client/use-cases` - Get available use cases for filtering
- `GET /api/client/sizes` - Get available sizes for filtering
- `GET /api/client/types` - Get available types/shapes for filtering

### Redux State Management

The application uses Redux Toolkit for state management with the following structure:

- **Rugs Slice**: Manages product data, loading states, and API calls
- **Custom Hooks**: `useRugs`, `useFeaturedRugs`, `useRecentRugs`, `useGroupedRugs`, `useFilterOptions`
- **Async Thunks**: Handle API calls with proper loading and error states

### Components Updated

1. **Featured Rugs**: Now fetches from API with size filtering
2. **Recent Rugs**: Shows latest products from API
3. **Use Cases**: Displays grouped products by use case
4. **Gallery**: Full filtering and search with API data
5. **Loading States**: Skeleton loaders for better UX

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://stitchit.test/api/client
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Project Structure

```
stitchit-web/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── home/              # Home page components
│   ├── gallery/           # Gallery components
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API service
├── redux/                 # Redux store and slices
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Key Features

### Home Page Integration
- **Featured Rugs**: Carousel with size filtering and API data
- **Recent Creations**: Latest products with horizontal scroll
- **Use Cases**: Interactive tabs showing grouped products by use case

### Gallery Page
- **Advanced Filtering**: Search, size, type, and use case filters
- **API Integration**: Real-time data with loading states
- **Responsive Grid**: Beautiful product grid with hover effects

### Loading States
- **Skeleton Loaders**: Smooth loading experience
- **Error Handling**: Graceful error states
- **Progressive Loading**: Content loads as needed

## API Data Flow

1. **Redux Thunks**: Handle API calls with loading states
2. **Custom Hooks**: Provide easy access to data and actions
3. **Components**: Use hooks to display data with loading states
4. **Error Handling**: Graceful fallbacks and error messages

## Development

The application is built with:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn/ui** for UI components

## API Configuration

The application is configured to use the development API at `http://stitchit.test/api/client`. To change the API URL, update the `NEXT_PUBLIC_API_URL` environment variable or modify `lib/api.ts`.

The API integration is fully dynamic with no hardcoded values - all data comes from the API endpoints.

## API Integration Features

- **Fully API-Driven**: No hardcoded product data
- **Dynamic Filtering**: All filter options come from API
- **Real-time Loading**: Skeleton loaders during API calls
- **Error Handling**: Graceful fallbacks for failed requests
- **Type Safety**: Full TypeScript support for API responses

The API integration follows the documented API structure with proper error handling and loading states. 