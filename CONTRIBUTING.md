# Contributing to Arenate Campus Events Dashboard

## Development Guidelines

### Code Style

This project follows these conventions:

1. **React Components**
   - Use functional components with hooks
   - Extract complex logic into custom hooks
   - Use descriptive component names (PascalCase)
   - Keep components focused and single-responsibility

2. **File Organization**
   ```
   src/
   ├── components/     # React components organized by feature
   ├── hooks/          # Custom React hooks
   ├── services/       # API/database interaction layer
   ├── utils/          # Utility functions and helpers
   ├── types/          # Type definitions (JSDoc)
   └── data/           # Mock data for development
   ```

3. **Naming Conventions**
   - Components: `PascalCase` (e.g., `EventCard.jsx`)
   - Hooks: `camelCase` starting with `use` (e.g., `useEventData.js`)
   - Utilities: `camelCase` (e.g., `formatDate.js`)
   - Constants: `UPPER_SNAKE_CASE` (e.g., `EVENT_TYPES`)

4. **State Management**
   - Use React hooks (useState, useEffect, useCallback, useMemo)
   - Extract reusable state logic into custom hooks
   - Keep state as local as possible
   - Use context for truly global state only

### Best Practices

1. **Performance**
   - Memoize expensive computations with `useMemo`
   - Memoize callbacks with `useCallback`
   - Use `React.memo` for components that render often with same props
   - Avoid inline object/array creation in render

2. **Error Handling**
   - Wrap components in ErrorBoundary
   - Handle async errors explicitly
   - Provide meaningful error messages to users
   - Use try-catch for risky operations

3. **Accessibility**
   - Use semantic HTML elements
   - Add ARIA labels where needed
   - Ensure keyboard navigation works
   - Test with screen readers

4. **Code Quality**
   - Run `npm run lint` before committing
   - Fix all ESLint warnings and errors
   - Write self-documenting code with clear names
   - Add JSDoc comments for complex functions

### Testing Locally

1. **Setup**
   ```bash
   npm install
   cp .env.example .env.local
   # Fill in your Supabase credentials in .env.local
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Lint Code**
   ```bash
   npm run lint
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

### Git Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with descriptive messages
   ```bash
   git commit -m "feat: add team filtering to dashboard"
   ```

3. Push your branch and create a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Common Issues and Solutions

#### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure API keys haven't expired

#### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (must be >= 20.19.0)
- Clear Vite cache: `rm -rf node_modules/.vite`

#### ESLint Errors
- Auto-fix where possible: `npm run lint -- --fix`
- Check for unused imports
- Ensure all variables are used or prefixed with `_`

### Adding New Features

1. **New Component**
   - Create in appropriate `components/` subdirectory
   - Add PropTypes or JSDoc comments
   - Export as default
   - Create a story if using Storybook (future)

2. **New Hook**
   - Create in `hooks/` directory
   - Prefix name with `use`
   - Document parameters and return values
   - Handle cleanup in useEffect returns

3. **New Utility**
   - Create in `utils/` directory
   - Add JSDoc comments
   - Write pure functions when possible
   - Add to constants file if adding magic strings

4. **New Service Method**
   - Add to appropriate service file
   - Handle errors consistently
   - Return { data, error } structure
   - Support mock data fallback

### Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
