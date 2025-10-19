# Architecture Documentation

## System Overview

Arenate is a campus events management system built with React, Vite, and Supabase. It enables students to discover events, form teams, and register for competitions.

## Technology Stack

### Frontend
- **React 19** - UI library with hooks
- **React Router v7** - Client-side routing
- **TailwindCSS 3** - Utility-first CSS framework
- **Vite 7** - Build tool and dev server

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Development Tools
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Application Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   └── LoginPage.jsx
│   ├── dashboard/      # Dashboard and event browsing
│   │   ├── DashboardPage.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── EventCarousel.jsx
│   │   ├── EventFilters.jsx
│   │   ├── EventGrid.jsx
│   │   ├── AnnouncementsPanel.jsx
│   │   └── MyEventsPanel.jsx
│   ├── event/          # Event details and registration
│   │   ├── EventDetailPage.jsx
│   │   └── EventRegistrationDrawer.jsx
│   ├── profile/        # User profile management
│   │   ├── ProfilePage.jsx
│   │   └── ProfilePrompt.jsx
│   └── shared/         # Reusable components
│       ├── ErrorBoundary.jsx
│       ├── LoadingSpinner.jsx
│       ├── Icons.jsx
│       └── CollegeLogo.jsx
```

### State Management

The application uses React hooks for state management:

1. **Component State** (`useState`)
   - Local UI state (form inputs, modals, etc.)
   - Component-specific temporary data

2. **Custom Hooks**
   - `useSupabaseAuth` - Authentication state
   - `useUserProfile` - User profile data
   - `useEventData` - Events, announcements, registrations
   - `useTeamManager` - Team operations
   - `useLocalStorage` - Persistent local state

3. **Props Drilling**
   - Data flows from App.jsx down through components
   - Callbacks passed down for state updates

### Data Flow

```
User Action
    ↓
Component Handler
    ↓
Custom Hook
    ↓
Service Layer (Repository)
    ↓
Supabase API
    ↓
Database
    ↓
Response
    ↓
Update State
    ↓
Re-render UI
```

## Key Features

### 1. Authentication
- Email/password authentication via Supabase
- Session management with automatic refresh
- Protected routes requiring authentication
- Mock mode for development without Supabase

### 2. Profile Management
- Required fields: name, department, college ID, graduation year
- Optional fields: phone, interests, bio, college email
- Profile completeness check gates dashboard access
- Backward compatible with old schema (no college fields)

### 3. Event Discovery
- Browse all campus events
- Filter by category, type, status, participation
- Search by name or organizer
- Featured event carousel
- Registration deadline tracking

### 4. Event Registration
- Solo registration for individual events
- Team registration for team-based competitions
- Team creation with customizable size limits
- Join existing teams with approval workflow
- Team member management (captain controls)

### 5. Team Management
- Create teams with min/max size constraints
- Public/private team visibility
- Join request system with notes
- Captain approval workflow
- Team locking for final registration
- Member role management

## Database Schema

### Core Tables

**events**
- Event information (name, date, organizer, category)
- Details JSONB field for flexible metadata
- Registration deadline tracking

**profiles**
- User profile information
- Links to Supabase auth.users
- Required and optional fields

**registrations**
- Links users to events
- Can be team-based or solo
- Tracks registration deadline

**teams**
- Team metadata and settings
- Links to event
- Status tracking (draft, pending, locked)

**team_members**
- Links users to teams
- Member role (captain, member)
- Status (accepted, pending, declined)
- Join request notes

**announcements**
- System-wide announcements
- Display on dashboard

### Relationships

```
users (auth.users)
  ↓ 1:1
profiles
  ↓ 1:N
registrations
  ↓ N:1
events

teams
  ↓ N:1
events

team_members
  ↓ N:1
teams
  ↓ N:1
profiles
```

## Security

### Frontend
- Environment variables for sensitive config
- Input sanitization and validation
- XSS prevention through React
- CSRF protection via Supabase
- Rate limiting on API calls

### Backend (Supabase)
- Row Level Security (RLS) policies
- Service role key never exposed to client
- JWT-based authentication
- Automatic token refresh

## Performance Optimizations

1. **React Optimizations**
   - `React.memo` for expensive components
   - `useMemo` for computed values
   - `useCallback` for stable callbacks
   - Lazy loading (future improvement)

2. **Network Optimizations**
   - Supabase connection pooling
   - Efficient query patterns
   - Minimal data fetching
   - Mock data fallback

3. **Build Optimizations**
   - Vite code splitting
   - Tree shaking
   - Minification
   - Asset optimization

## Error Handling

### Levels
1. **Component Level** - Try-catch in async operations
2. **Hook Level** - Error state management
3. **Service Level** - Consistent error objects
4. **Boundary Level** - ErrorBoundary catch-all

### Error Format
```javascript
{
  data: null,
  error: Error | { message: string, code?: string }
}
```

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Configure Supabase credentials
5. Run: `npm run dev`

### Production Build
1. Build: `npm run build`
2. Preview: `npm run preview`
3. Deploy: Push to Vercel/Netlify

### Database Migrations
1. Local: `npm run supabase:db-push`
2. Reset: `npm run supabase:db-reset`
3. Remote: Via Supabase CLI

## Future Improvements

1. **Testing**
   - Add Vitest for unit tests
   - Add React Testing Library
   - Add E2E tests with Playwright

2. **Features**
   - Real-time updates via Supabase subscriptions
   - Push notifications
   - Advanced team search/filtering
   - Event recommendations
   - Admin dashboard

3. **Performance**
   - Implement virtual scrolling
   - Add service worker for offline support
   - Optimize image loading
   - Add request caching

4. **Developer Experience**
   - Add Storybook for component development
   - Improve TypeScript coverage
   - Add commit hooks (husky)
   - Automated deployment previews

## Troubleshooting

### Common Issues

**Vite won't start**
- Check Node version >= 20.19.0
- Clear cache: `rm -rf node_modules/.vite`
- Reinstall: `rm -rf node_modules && npm install`

**Supabase connection fails**
- Verify .env.local exists and has correct values
- Check Supabase project is active
- Verify API keys in Supabase dashboard

**Build fails**
- Run `npm run lint` to check for errors
- Check for TypeScript errors
- Verify all imports are correct

**Teams not working**
- Verify database migrations are applied
- Check RLS policies in Supabase
- Verify user has completed profile

## Resources

- [Project README](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
