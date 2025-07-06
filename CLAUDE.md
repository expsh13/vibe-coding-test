# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project using SWC for fast refresh. The project is configured for modern React development with comprehensive TypeScript support.

## Package Manager

This project uses **pnpm** as the package manager. Always use `pnpm` commands instead of npm or yarn.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Run tests (after setup)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests (after setup)
pnpm test:e2e
```

## Testing Setup

The project is configured for comprehensive testing:

**Unit & Integration Tests:**
- Vitest as test runner
- React Testing Library for component testing
- jsdom for DOM simulation
- MSW (Mock Service Worker) for API mocking

**E2E Tests:**
- Playwright for end-to-end testing

## Architecture

- **Build Tool:** Vite with SWC plugin for fast React refresh
- **TypeScript:** Configured with strict settings, split into app and node configs
- **Linting:** ESLint with TypeScript, React Hooks, and React Refresh rules
- **Component Structure:** Standard React functional components with hooks
- **Styling:** CSS modules pattern (based on App.css structure)

## Key Configuration Files

- `vite.config.ts` - Vite configuration with React SWC plugin
- `tsconfig.json` - Root TypeScript config with project references
- `tsconfig.app.json` - App-specific TypeScript settings
- `tsconfig.node.json` - Node/build tools TypeScript settings
- `eslint.config.js` - ESLint configuration with React and TypeScript rules

## Test Organization

Tests should be organized as:
- Unit tests: `src/**/*.test.{ts,tsx}`
- Integration tests: `src/**/*.integration.test.{ts,tsx}`
- E2E tests: `tests/` or `e2e/` directory

## Testing Guidelines

**All tests MUST follow these rules:**

1. **Japanese Test Descriptions**: All test descriptions must be written in Japanese
   ```typescript
   // ✅ Required
   describe('TodoItemコンポーネント', () => {
     it('Todo内容を表示する', () => {})
   })
   
   // ❌ Not allowed
   describe('TodoItem Component', () => {
     it('renders todo content', () => {})
   })
   ```

2. **AAA Pattern Comments**: Every test case must include Arrange-Act-Assert comments
   ```typescript
   it('新しいTodoが追加される', () => {
     // Arrange - テストデータと初期状態を準備
     const input = screen.getByTestId('add-todo-input')
     
     // Act - テスト対象の操作を実行
     fireEvent.change(input, { target: { value: 'テスト内容' } })
     
     // Assert - 期待される結果を検証
     expect(screen.getByText('テスト内容')).toBeInTheDocument()
   })
   ```

3. **Import beforeEach**: Always import `beforeEach` from vitest when using it
   ```typescript
   import { describe, it, expect, vi, beforeEach } from 'vitest'
   ```

4. **Mock Cleanup**: Always clear mocks in beforeEach
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks()
   })
   ```

For detailed testing guidelines, see `docs/testing-guidelines.md`