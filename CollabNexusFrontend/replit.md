# CollabNexus

## Overview

CollabNexus is a gamified collaborative project management platform that connects team members, enables project coordination, and tracks progress through an XP-based leveling system. The application combines skill-based matchmaking, Kanban-style task management, peer reviews, and analytics dashboards to create an engaging team collaboration experience.

The platform features a modern, minimalist UI inspired by Linear and Material Design principles, with subtle animations and a clean aesthetic. Users can find teammates based on skills and interests, manage projects with task boards, earn experience points for completing tasks, and provide peer feedback to improve team dynamics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack**: React 18 + TypeScript + Vite
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system tokens
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions and micro-interactions

**Design System**:
- Typography: Inter (primary), JetBrains Mono (code/stats)
- Color scheme: HSL-based token system supporting light/dark modes
- Component theming: CSS variables for consistent styling
- Spacing: Tailwind's standardized scale (2, 4, 6, 8, 12, 16, 20)

**Component Architecture**:
- Reusable UI components in `/client/src/components/ui/`
- Feature-specific components (FeatureCard, TaskCard, XPBar, LevelBadge)
- Protected route wrapper for authentication guards
- Context-based authentication state management

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- **Build Tool**: esbuild for production bundling
- **Development**: tsx for TypeScript execution
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Middleware**: JSON body parsing, request logging, raw body capture for webhooks

**Database Layer**:
- **ORM**: Drizzle ORM for type-safe database queries
- **Database**: PostgreSQL (via Neon serverless driver)
- **Schema**: Defined in `/shared/schema.ts` with Zod validation
- **Migrations**: Drizzle Kit for schema management

**Data Models**:
- Users: Firebase UID integration, skills/interests arrays, XP/level tracking
- Projects: Owner-based with team member arrays
- Tasks: Status tracking, priority levels, XP rewards, assignee references
- Reviews: Peer feedback with ratings and tags
- Milestones: Achievement tracking with completion status and XP rewards

**Storage Interface** (`/server/storage.ts`):
- Abstraction layer for data operations
- Supports user management, project CRUD, task operations, progress tracking
- Skill-based teammate matching algorithm
- In-memory implementation (can be swapped with database implementation)

### Authentication System

**Firebase Authentication**:
- Email/password authentication via Firebase Auth SDK
- Client-side auth state management with `onAuthStateChanged`
- Custom `AuthContext` provider wrapping the application
- Protected routes using `ProtectedRoute` component

**User Flow**:
1. Firebase handles authentication (signup/login)
2. Backend creates/syncs user records with Firebase UID
3. Client stores Firebase user + application user data
4. API requests authenticated via Firebase session

**Session Management**:
- Firebase handles token refresh automatically
- User data fetched on auth state change
- Logout clears both Firebase session and local state

### Real-time Features

**Firestore Integration**:
- Real-time listeners via `onSnapshot` for live updates
- Collections: tasks, reviews, milestones
- Subscription functions in `/client/src/services/firestore.ts`
- Automatic unsubscribe on component unmount

**Live Data Sync**:
- Task updates propagate to all team members instantly
- Project progress calculations update in real-time
- Review submissions appear immediately for all viewers

### Client-Server Communication

**API Client**: Axios-based service layer (`/client/src/services/api.ts`)
- Type-safe request/response handling
- Centralized error handling
- RESTful endpoint structure

**React Query Integration**:
- Custom hooks for data fetching (`useProjects`, `useTasks`)
- Automatic cache invalidation on mutations
- Optimistic updates for better UX
- Background refetching disabled (Firestore handles real-time)

**Proxy Pattern**:
- Express server can proxy to external Flask backend
- Environment variable configuration for backend URL
- Gradual migration strategy from Flask to Node.js

## External Dependencies

### Third-Party Services

**Firebase Suite**:
- Firebase Authentication (email/password provider)
- Cloud Firestore (real-time database for tasks, reviews, milestones)
- Configuration via environment variables (API key, project ID, app ID)
- Web SDK v9+ modular architecture

**Neon Database**:
- Serverless PostgreSQL hosting
- Connection via `@neondatabase/serverless` driver
- Connection string in `DATABASE_URL` environment variable
- Used for core application data (users, projects, base records)

### UI Component Libraries

**Radix UI Primitives**:
- Headless accessible components (Dialog, Dropdown, Popover, etc.)
- 25+ primitive components installed
- Custom styled via Tailwind CSS
- Composable pattern for complex UI elements

**shadcn/ui Configuration**:
- Component registry: "new-york" style
- TypeScript + TSX enabled
- Tailwind integration with CSS variables
- Path aliases for clean imports (`@/components`, `@/lib`)

### Build & Development Tools

**Vite Plugins**:
- `@vitejs/plugin-react` for React Fast Refresh
- `@replit/vite-plugin-runtime-error-modal` for error overlays
- `@replit/vite-plugin-cartographer` for Replit IDE integration (dev only)
- `@replit/vite-plugin-dev-banner` for development indicators (dev only)

**Development Environment**:
- Hot module replacement via Vite middleware
- Custom Express middleware for SPA routing
- TypeScript type checking (noEmit mode)
- Path aliases configured in tsconfig.json and Vite config

### Charting & Visualization

**Recharts**:
- Bar charts for team contribution tracking
- Pie charts for task completion distribution
- Responsive container for mobile/desktop layouts
- Custom tooltips and styling

### Animation Library

**Framer Motion**:
- Page transitions and micro-interactions
- Staggered card animations with delay multipliers
- Hover/tap effects on interactive elements
- Spring-based physics for natural motion

### Utility Libraries

- `clsx` + `tailwind-merge`: Dynamic className composition
- `class-variance-authority`: Component variant system
- `date-fns`: Date formatting and manipulation
- `nanoid`: Unique ID generation
- `axios`: HTTP client for API requests
- `cmdk`: Command menu component (search/navigation)

### Form Handling

- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod schema validation integration
- `zod`: Runtime type validation
- `drizzle-zod`: Auto-generate Zod schemas from Drizzle tables