# CollabNexus Design Guidelines

## Design Approach
**Hybrid Approach**: Material Design structure + Linear-inspired minimalism with gamified elements inspired by productivity platforms like Notion and Asana, enhanced with modern SaaS aesthetics.

**Design Principles**:
- Clean, minimal, slightly futuristic aesthetic
- Performance-first animations (subtle, purposeful)
- Information density balanced with breathing room
- Gamification without childishness - professional gaming UI elements

## Typography
**Font Stack**: Inter (primary), JetBrains Mono (code/stats)
- Headings: font-bold (700), tracking-tight
- Hero/Feature Titles: text-4xl to text-6xl
- Section Headers: text-2xl to text-3xl
- Body: text-base (400), leading-relaxed
- Small Text/Metadata: text-sm (500)
- Stats/Numbers: font-semibold, tabular-nums

## Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16, 20
- Component padding: p-6, p-8
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-6, gap-8
- Container max-widths: max-w-7xl with px-4

## Homepage Structure

**Hero Section** (70vh):
- Full-width with subtle gradient overlay
- Centered content: max-w-4xl
- Large heading (text-5xl lg:text-6xl) + subheading
- Dual CTA buttons: primary "Get Started" + secondary "Learn More"
- Floating stat badges: "500+ Teams", "10K+ Projects"

**Feature Cards Grid** (4 cards, grid-cols-1 md:grid-cols-2 gap-8):
Each card: rounded-2xl, p-8, border, hover:shadow-xl transition
- Icon container (w-12 h-12, rounded-lg)
- Feature title (text-2xl font-bold)
- Description (text-base, max 2 lines)
- "Explore →" link
- Subtle hover lift: hover:-translate-y-1

**How It Works Section**:
3-step process in grid-cols-1 md:grid-cols-3
- Step number badge (circular, text-3xl font-bold)
- Step title + description
- Arrow connectors between steps (hidden on mobile)

**Social Proof Section**:
- "Trusted by teams worldwide" heading
- Logo cloud grid (grid-cols-2 md:grid-cols-4)
- Testimonial cards carousel (2-3 visible)

## Core Components

**Navbar**:
Fixed top, backdrop-blur-lg, border-b
- Logo left
- Nav links center (Home, Features, Dashboard, Projects)
- Auth buttons right (Login + Sign Up with different weights)
- Mobile: hamburger menu, slide-in drawer

**Feature Cards** (Homepage):
- Aspect ratio 1:1 or 4:3
- Icon + gradient background in top section
- Content section with title, description, CTA
- Hover: scale-105, shadow animation

**XP Bar Component**:
- Horizontal progress bar: h-3, rounded-full
- Fill animation: transition-all duration-500
- Current/Max XP labels (text-sm font-medium)
- Pulse animation when gaining XP

**Level Badge**:
- Hexagonal or shield shape using clip-path
- Level number prominent (text-3xl font-bold)
- Border glow effect
- Animated level-up: scale + rotate

**Milestone Card**:
- Horizontal layout: icon left, content right
- Progress ring (circular progress indicator)
- Completion percentage (text-2xl)
- Checkmark icon when complete
- Subtle gradient background

**Kanban Board**:
3 columns: equal width on desktop (grid-cols-3)
- Column headers: sticky top, font-semibold, uppercase text-xs
- Task cards: rounded-lg, p-4, shadow-sm
- Drag indicator: 6 dots icon
- Empty state: dashed border, centered message
- Smooth transition between columns

**Task Card**:
- Compact: p-4, rounded-lg
- Title (font-semibold)
- Assignee avatar (w-6 h-6, rounded-full)
- Priority badge (rounded-full px-2 py-1 text-xs)
- Due date (text-sm with clock icon)

**Dashboard Charts**:
- Donut chart for task completion (center: percentage)
- Bar chart for contributions (horizontal bars)
- Card containers: rounded-xl, p-6
- Chart labels: text-sm font-medium

**Review Card**:
- Profile section: avatar + name + date
- Star rating (5 stars, filled/outlined)
- Feedback text (max-h-32, overflow-y-auto)
- Tags for categories (rounded-full badges)

**Teammate Suggestion Card**:
- Avatar (w-20 h-20, rounded-full, border-4)
- Name + role (text-center)
- Skills tags (flex-wrap, gap-2)
- Match percentage (circular badge)
- "Connect" button (full-width)

## Authentication Pages

**Layout**: Centered card approach
- Card: max-w-md, rounded-2xl, p-8, shadow-2xl
- Logo + heading centered above form
- Form inputs: rounded-lg, p-3, border
- Primary button: w-full, py-3, rounded-lg
- Social divider: "OR" with horizontal lines
- Footer link: "Don't have an account?" styled subtle

## Animations

**Page Transitions**: Fade-in (opacity 0→1, duration-300)
**Card Hover**: translate-y-1 + shadow-xl
**XP Gain**: Scale pulse (1→1.1→1) + glow
**Task Completion**: Checkmark draw animation
**Level Up**: Confetti burst + scale animation
**Loading States**: Skeleton screens with shimmer

## Accessibility
- Focus rings: ring-2 ring-offset-2
- ARIA labels on all interactive elements
- Keyboard navigation for Kanban drag-drop
- High contrast text ratios
- Screen reader announcements for XP gains

## Images
**Hero Background**: Abstract geometric pattern or collaborative workspace scene (subtle overlay)
**Feature Icons**: Use Heroicons library (outline style)
**Avatars**: Placeholder using initials with gradient backgrounds
**Empty States**: Minimal illustration style (single color, simple shapes)