# Architecture Documentation

## System Overview

Neural Network Builder is a modern, scalable monorepo application built with TypeScript, React, and Node.js. The architecture follows industry best practices for maintainability, testability, and scalability.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Components │  │  State (Zustand) │  │  Services (TF.js) │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Routes    │  │   Services   │  │   Database       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             │
┌─────────────────────────────────────────────────────────────┐
│                      Shared Package                          │
│         Types, Constants, Utilities, Validators              │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── architect/       # Architecture builder components
│   ├── dataset/         # Dataset manager components
│   ├── training/        # Training components
│   └── evaluation/      # Evaluation dashboard components
│
├── pages/               # Route pages
├── store/               # Zustand stores
├── services/            # External services (TensorFlow.js, API)
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

### State Management with Zustand

We use Zustand for state management with the following benefits:
- Simple API with minimal boilerplate
- Built-in TypeScript support
- Immer middleware for immutable updates
- Persistence middleware for localStorage

Example store:
```typescript
export const useNetworkStore = create<NetworkState>()(
  persist(
    immer((set) => ({
      config: initialConfig,
      addLayer: (layer) => set((state) => {
        state.config.layers.push(layer)
      }),
    })),
    { name: 'network-storage' }
  )
)
```

### Data Flow

1. **User Action** → Component
2. **Component** → Zustand Store Action
3. **Store** → Updates State (via Immer)
4. **State Change** → Re-renders Components
5. **Persist** → LocalStorage/IndexedDB

## Backend Architecture

### API Structure

```
/api/v1/
├── /models          # Model CRUD operations
├── /datasets        # Dataset management
├── /templates       # Architecture templates
├── /training        # Training jobs
└── /compression     # Model compression
```

### Service Layer Pattern

```typescript
// Route (HTTP Layer)
router.post('/models', modelController.create)

// Controller (Request Handling)
async create(req, res) {
  const model = await modelService.create(req.body)
  res.json(model)
}

// Service (Business Logic)
async create(data) {
  const validated = validateModel(data)
  return await db.models.create(validated)
}
```

## Shared Package

The shared package contains:
- **Types**: All TypeScript interfaces/types
- **Constants**: Layer configs, sample datasets
- **Validators**: Zod schemas
- **Utilities**: Helper functions

This ensures type safety across frontend and backend.

## Data Models

### Network Configuration
```typescript
interface NetworkConfig {
  project: ProjectInfo
  layers: Layer[]
  hyperparameters: HyperParameters
  preprocessing?: PreprocessingConfig
}
```

### Layer Types
- Input, Conv2D, Dense, Dropout, Pooling
- LSTM, GRU, Transformer, Attention
- BatchNorm, Flatten, GlobalPooling

## Performance Optimizations

### Frontend
- **Code Splitting**: Route-based chunks
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Virtual Lists**: For large layer lists
- **Web Workers**: For heavy computations

### Backend
- **Caching**: Redis for frequent queries
- **Database Indexing**: Optimized queries
- **Compression**: gzip responses
- **Rate Limiting**: Prevent abuse

## Security

### Frontend
- CSP headers via Vite
- XSS protection
- HTTPS only in production
- Input validation with Zod

### Backend
- Helmet.js security headers
- CORS configuration
- Input sanitization
- Rate limiting
- SQL injection prevention (Prisma)

## Testing Strategy

### Unit Tests
- Components: React Testing Library
- Stores: Zustand test utilities
- Services: Jest

### Integration Tests
- API routes: Supertest
- Database: Test containers

### E2E Tests
- User flows: Playwright
- Critical paths: Cypress

## Deployment

### Frontend (Vercel)
- Automatic deployments from git
- Edge network for fast delivery
- Preview deployments for PRs

### Backend (Railway)
- Containerized deployment
- Auto-scaling
- Managed PostgreSQL/Redis

## Monitoring

- **Error Tracking**: Sentry
- **Analytics**: Posthog
- **Performance**: Vercel Analytics
- **Logs**: Structured logging with Winston

## Future Considerations

- **GraphQL**: Replace REST with GraphQL
- **Server Components**: Migrate to Next.js 14
- **Micro-frontends**: Split large features
- **Kubernetes**: For advanced scaling
- **Real-time**: WebSockets for collaborative editing
