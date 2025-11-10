# 🧠 Neural Network Builder

A modern, professional web application for designing, training, and evaluating neural networks in your browser. Built with React, TypeScript, and TensorFlow.js.

![Neural Network Builder](https://img.shields.io/badge/version-2.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🏗️ Visual Architecture Builder
- Drag-and-drop layer creation
- 15+ layer types (Conv2D, LSTM, Transformer, Attention, etc.)
- Real-time architecture validation
- Smart layer suggestions
- Transfer learning support
- Pre-built architecture templates

### 📊 Dataset Management
- Sample datasets (MNIST, CIFAR-10, Fashion MNIST, IMDB)
- Custom dataset upload (images, CSV, JSON)
- Data augmentation pipeline
- Train/validation/test splitting
- Preprocessing configuration

### 🚀 Training Simulator
- Real-time training visualization
- Live metrics (loss, accuracy)
- Learning rate scheduling
- Early stopping
- Model checkpointing
- GPU acceleration (WebGL)

### 📈 Evaluation Dashboard
- Confusion matrix
- ROC curves
- Per-class metrics
- Interactive visualizations
- Model comparison

### 💾 Import/Export
- Save/load models
- Export to TensorFlow.js format
- Version history
- Model sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+ (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/biblicalandr0id/Neural-Network-Builder.git
cd Neural-Network-Builder

# Install dependencies
pnpm install

# Start development servers (frontend + backend)
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/v1

## 📦 Tech Stack

### Frontend
- **Framework**: React 18.2 with TypeScript 5.3
- **Build Tool**: Vite 5
- **State Management**: Zustand with persist & immer middleware
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 3
- **ML Framework**: TensorFlow.js 4.x
- **Visualization**: Recharts, TensorFlow.js Vis
- **Routing**: React Router 6

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express 4
- **Language**: TypeScript 5.3
- **Security**: Helmet, CORS
- **Validation**: Zod

### DevOps
- **Monorepo**: pnpm workspaces
- **Build System**: Turborepo
- **Code Quality**: ESLint, Prettier
- **Testing**: Vitest, React Testing Library

## 📁 Project Structure

```
Neural-Network-Builder/
├── packages/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── components/   # UI components
│   │   │   ├── pages/        # Route pages
│   │   │   ├── store/        # Zustand stores
│   │   │   ├── services/     # TensorFlow.js services
│   │   │   └── hooks/        # Custom React hooks
│   │   └── package.json
│   │
│   ├── backend/           # Express API server
│   │   ├── src/
│   │   │   ├── routes/       # API routes
│   │   │   ├── services/     # Business logic
│   │   │   └── middleware/   # Express middleware
│   │   └── package.json
│   │
│   └── shared/            # Shared types & utilities
│       ├── src/
│       │   ├── types/        # TypeScript interfaces
│       │   ├── constants/    # Shared constants
│       │   └── validators/   # Zod schemas
│       └── package.json
│
├── docs/                  # Documentation
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml   # Workspace config
└── package.json          # Root package
```

## 🛠️ Development

### Available Scripts

```bash
# Development (runs frontend + backend concurrently)
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Clean build artifacts
pnpm clean
```

### Working on Individual Packages

```bash
# Frontend only
pnpm --filter frontend dev

# Backend only
pnpm --filter backend dev

# Shared package
pnpm --filter shared build
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)

## 🗺️ Roadmap

### Phase 1: Core Foundation ✅
- [x] Monorepo structure
- [x] Type system
- [x] State management
- [x] Routing
- [x] Basic UI components

### Phase 2: Feature Implementation (In Progress)
- [ ] Complete architect page with layer builder
- [ ] Dataset manager with upload functionality
- [ ] Training simulator with real-time visualization
- [ ] Evaluation dashboard with metrics
- [ ] Model import/export

### Phase 3: Advanced Features
- [ ] Collaborative editing (WebSockets)
- [ ] Cloud training integration
- [ ] Model marketplace
- [ ] AutoML capabilities
- [ ] Mobile app

### Phase 4: Production
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment pipeline
- [ ] Documentation completion

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow.js team for the amazing ML framework
- Radix UI and shadcn/ui for beautiful, accessible components
- The open-source community for inspiration and tools

## 📧 Contact

- GitHub: [@biblicalandr0id](https://github.com/biblicalandr0id)
- Project: [Neural Network Builder](https://github.com/biblicalandr0id/Neural-Network-Builder)

---

Built with ❤️ using React, TypeScript, and TensorFlow.js
