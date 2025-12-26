# Contributing to FPL API

Thank you for your interest in contributing to the FPL API! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Node version, etc.)
- **Error messages** or logs if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why this enhancement would be useful
- **Proposed solution** if you have one
- **Alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** - use ESLint and the existing code style
3. **Write clear commit messages** - use conventional commits format
4. **Add tests** if applicable
5. **Update documentation** for any changed functionality
6. **Ensure all tests pass** before submitting

#### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md following the existing format
3. The PR will be merged once you have approval from maintainers

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fpl-api.git
   cd fpl-api
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   yarn db:push
   ```

5. **Start development server**
   ```bash
   yarn dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Export types that might be reused

### Code Style

- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(graphql): add pagination to elements query

fix(sync): handle API timeout errors gracefully

docs(readme): update installation instructions
```

## Testing

- Write tests for new features
- Ensure existing tests pass: `yarn test`
- Maintain or improve code coverage

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update API documentation for endpoint changes
- Include examples for new features

## Questions?

Feel free to open an issue with the `question` label if you need help or clarification.

Thank you for contributing!
