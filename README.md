# Directionally Web

A modern web-based 3D scene editor built with Svelte 5 and TypeScript.

## Architecture Overview

The application is structured around a core scene management system with a modern UI layer built on top. Here's a high-level overview of how everything fits together:

### Core System (`src/lib/core/`)

The core system handles the fundamental scene management and production operations:

- **Production Management**
  - `ProductionManager.ts`: Manages production lifecycle and state
  - `ProductionInterfaces.ts`: Core interfaces for production operations
  - Uses an observer pattern for production state changes

- **Scene System**
  - `Scene.ts`: Core scene management
  - `SceneViewer.ts`: 3D scene rendering and manipulation
  - Camera management and view controls

- **Command System**
  - `Command.ts`: Base command interface
  - `commands/`: Directory containing specific command implementations
  - Supports undo/redo operations

- **Catalog System**
  - `Catalog.ts`: Manages available items/components
  - `CatalogManager.ts`: Handles catalog operations and item instantiation
  - `catalog/`: Directory containing catalog item definitions

### UI Layer (`src/lib/components/`)

The UI layer is built with Svelte 5 components and provides the user interface for interacting with the core system:

- **Layout Components**
  - `AppLayout.svelte`: Main application layout
  - `MainContent.svelte`: Central content area with view management
  - `LeftSidebar.svelte`: Navigation and production management
  - `Toolbar.svelte`: Main action toolbar

- **View System**
  - `views/`: Directory containing different view types
  - `View3D.svelte`: 3D scene view
  - `WelcomeView.svelte`: Initial welcome screen
  - View management handled by `MainContent.svelte`

- **Panels**
  - `panels/`: Directory containing various UI panels
  - `CatalogPanel.svelte`: Catalog item browser
  - `SceneGraphPanel.svelte`: Scene hierarchy view
  - `PropertiesPanel.svelte`: Object properties editor

### Type System (`src/lib/types/`)

TypeScript interfaces and types used throughout the application:

- `production.ts`: Production-related types
- `view.ts`: View management types
- `catalog.ts`: Catalog item types

### UI Utilities (`src/lib/ui/`)

Supporting UI functionality:

- `keyboard/`: Keyboard shortcut management

## Development Guidelines

### State Management

- Use Svelte 5's built-in reactivity (`$state`, `$derived`, `$effect`)
- Avoid global stores where possible
- Use context for sharing state between components

### Component Structure

- Keep components focused and single-responsibility
- Use TypeScript interfaces for props and state
- Follow Svelte's component composition patterns

### Command System

- All scene modifications should go through the command system
- Commands should be reversible (implement undo)
- Use the command executor for all operations

### View Management

- Views are managed by `MainContent.svelte`
- New views should be added to the view type system
- Views should be self-contained and communicate through props

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── lib/
│   ├── core/           # Core scene and production management
│   ├── components/     # Svelte components
│   ├── types/          # TypeScript types and interfaces
│   ├── ui/            # UI utilities and helpers
│   └── styles/        # Global styles
└── routes/            # SvelteKit routes
```

## Contributing

1. Follow the established architecture patterns
2. Use TypeScript for all new code
3. Write self-productioning code with clear interfaces
4. Keep components focused and maintainable
