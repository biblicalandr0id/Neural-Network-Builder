# Contributing to Neural Network Builder

Thank you for your interest in contributing to Neural Network Builder! This document provides guidelines and instructions for contributing to the project.

## 🌟 Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and collaborative environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 8+ (recommended) or npm
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Neural-Network-Builder.git
   cd Neural-Network-Builder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

## 📝 Development Workflow

### Project Structure

This is a monorepo with three main packages:

- **`packages/frontend`**: React application
- **`packages/backend`**: Express API server
- **`packages/shared`**: Shared types and utilities

### Working on Features

1. **Choose an issue** or create one describing what you want to work on
2. **Assign yourself** to the issue to avoid duplicate work
3. **Create a branch** following the naming convention:
   - `feature/description` for new features
   - `fix/description` for bug fixes
   - `refactor/description` for refactoring
   - `docs/description` for documentation

4. **Make your changes** following our coding standards (see below)
5. **Write tests** for your changes
6. **Update documentation** if needed
7. **Submit a pull request**

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all code (no `.js` or `.jsx` files)
- Prefer interfaces over types for object shapes
- Use explicit return types for functions
- Enable strict mode in tsconfig.json

```typescript
// Good
interface UserProps {
  name: string
  age: number
}

function greetUser(user: UserProps): string {
  return `Hello, ${user.name}!`
}

// Avoid
const greetUser = (user: any) => {
  return `Hello, ${user.name}!`
}
```

### React Components

- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript interfaces for props
- Extract complex logic into custom hooks
- Keep components small and focused

```typescript
// Good
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  )
}
```

### State Management

- Use Zustand for global state
- Use React hooks (useState, useReducer) for local state
- Keep state as close to where it's used as possible
- Use immer middleware for complex state updates

```typescript
// Good - Zustand store with immer
export const useNetworkStore = create<NetworkState>()(
  persist(
    immer((set) => ({
      layers: [],
      addLayer: (layer) =>
        set((state) => {
          state.layers.push(layer)
        }),
    })),
    { name: 'network-storage' }
  )
)
```

### File Organization

- One component per file
- Co-locate related files (component + styles + tests)
- Use index files for cleaner imports
- Group by feature, not by type

```
components/
├── architect/
│   ├── LayerBuilder/
│   │   ├── LayerBuilder.tsx
│   │   ├── LayerBuilder.test.tsx
│   │   ├── LayerCard.tsx
│   │   └── index.ts
│   └── index.ts
```

### Styling

- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Use CSS variables for theming
- Keep responsive design in mind

```tsx
// Good - Tailwind utilities
<div className="flex items-center gap-4 p-4 rounded-lg bg-card">
  <h2 className="text-2xl font-bold">Title</h2>
</div>
```

### Naming Conventions

- **Components**: PascalCase (`LayerBuilder.tsx`)
- **Files**: kebab-case (`layer-builder.ts`)
- **Functions**: camelCase (`addLayer`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LAYERS`)
- **Interfaces**: PascalCase with descriptive names (`LayerConfig`, `NetworkState`)
- **Types**: PascalCase (`LayerType`)

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Use React Testing Library for component tests
- Use Vitest for unit tests
- Aim for >80% code coverage

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button label="Click me" onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('Click me'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter frontend test
```

## 📋 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(architect): add drag-and-drop layer reordering

- Implement drag-and-drop using @dnd-kit
- Add visual feedback during drag
- Update layer order in store

Closes #123

---

fix(training): resolve memory leak in training loop

The training visualization was not cleaning up TensorFlow.js tensors,
causing memory to grow unbounded during long training sessions.

Fixes #456
```

## 🔍 Code Review Process

### Submitting a Pull Request

1. **Update your branch** with the latest main
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run checks locally**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   pnpm build
   ```

3. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request** on GitHub with:
   - Clear title following commit convention
   - Description of changes
   - Screenshots/videos for UI changes
   - Link to related issue(s)
   - Test plan

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots
(if applicable)

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manually tested feature X
- [ ] Tested on different browsers

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Review Guidelines

- Be respectful and constructive
- Focus on the code, not the person
- Explain the "why" behind suggestions
- Approve when the code is good enough, not perfect
- Request changes only for serious issues

## 🏗️ Architecture Guidelines

### Adding New Features

1. **Plan first**: Create an issue with design proposal
2. **Type definitions**: Add types to `packages/shared/src/types`
3. **Backend API**: Add routes in `packages/backend/src/routes`
4. **Frontend components**: Create in appropriate feature folder
5. **State management**: Add to Zustand store if needed
6. **Documentation**: Update relevant docs

### State Management Rules

- **Local state**: Use `useState` for component-only state
- **Shared state**: Use Zustand for cross-component state
- **Server state**: Consider React Query for API data
- **Form state**: Use React Hook Form for complex forms

### Performance Considerations

- Use `React.memo` for expensive components
- Use `useMemo` and `useCallback` appropriately
- Implement virtual scrolling for large lists
- Code split by route
- Lazy load heavy components
- Dispose TensorFlow.js tensors properly

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try to reproduce in latest version
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 2.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if it's already requested
2. Describe the problem it solves
3. Provide use cases
4. Consider implementation complexity

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## ❓ Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues for similar questions

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to Neural Network Builder! 🎉
