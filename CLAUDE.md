# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Generate static files**: `npm run generate`

### Code Quality
- **Lint code**: `npm run lint`
- **Auto-fix linting issues**: `npm run lint:fix`

### Database Operations
- **Initialize database**: `npm run init-db` (runs Sequelize migrations)
- **Create migration**: `npm run create-migration -- <migration_name>`

## Architecture Overview

### Tech Stack
- **Frontend**: Nuxt 3 with Vue 3, TypeScript, TailwindCSS
- **UI Components**: @nuxt/ui, @heroicons/vue, @headlessui/vue
- **Backend**: Nuxt server API routes with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: nuxt-auth-utils with JWT tokens
- **Text Editing**: TipTap editor
- **PDF Generation**: Puppeteer and custom PDF service
- **State Management**: Pinia
- **Styling**: TailwindCSS with custom color palette and SCSS

### Key Directory Structure
```
components/
├── admin/          # Admin interface components
├── poems/          # Book/poem display components
├── ui/             # Reusable UI components
├── layout/         # Layout components (navbar, footer)
└── landing/        # Landing page components

server/
├── api/            # API endpoint handlers
├── models/         # Sequelize database models
├── services/       # Business logic services
├── middleware/     # Server middleware
└── utils/          # Server utilities

pages/              # Nuxt 3 file-based routing
layouts/            # Page layouts
stores/             # Pinia stores
entities/           # TypeScript entity definitions
```

### Database Models
The application uses Sequelize with these main entities:
- **Post**: Core content/poem model
- **User**: User authentication and admin roles
- **Attachment**: File attachments linked to posts
- **Prospect**: Lead/prospect management
- **ApiToken**: API authentication tokens

### Key Features
1. **Book Generation**: PDF generation service that creates books from poems/posts
2. **Admin Interface**: Content management system for posts, imports, and book generation
3. **API Import System**: Supports importing content from external APIs (Flux, etc.)
4. **Authentication**: JWT-based auth with admin/user roles
5. **Content Editor**: Rich text editing with TipTap
6. **File Upload**: Image and document upload functionality

### Configuration Notes
- Database config is in `config/config.json` (PostgreSQL for dev/test, configurable for production)
- Environment variables include `PDF_API_TOKEN` for PDF generation service
- Fonts are loaded from Fontshare (Cabinet Grotesk, Satoshi) and local Cormorant family
- Custom page sizing with TailwindCSS extensions for book layouts

### Development Notes
- Uses Docker with separate dev and production Dockerfiles
- Makefile available for common operations
- Custom SCSS in `assets/styles/` for specialized book formatting
- ESLint configuration with Nuxt-specific rules
- TypeScript strictly configured throughout the stack