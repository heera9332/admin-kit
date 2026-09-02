# Design System

## Typography
Primary font: Lexend.

Use a consistent type scale:
- xs
- sm
- base
- lg
- xl
- 2xl
- 3xl

## Design Tokens
Use semantic tokens rather than hardcoded colors:
- background
- foreground
- card
- card-foreground
- muted
- muted-foreground
- border
- input
- primary
- secondary
- destructive
- success
- warning
- info

## Themes
Support:
- Light
- Dark
- System

## Layout
The admin shell should support:
- Expanded sidebar
- Collapsed sidebar
- Mobile drawer
- Nested navigation
- Header
- Breadcrumbs
- Search
- Notifications
- User menu
- Command palette

## Components

### Core
Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Badge, Avatar, Separator.

### Overlay
Dialog, Sheet, Drawer, Popover, Tooltip, Dropdown, Context Menu, Command.

### Navigation
Sidebar, Navbar, Breadcrumb, Tabs, Pagination, Stepper.

### Data
Card, Table, DataTable, StatCard, Timeline, EmptyState, Skeleton.

### Feedback
Alert, Toast, Progress, LoadingState, ErrorState, ConfirmationDialog.

## Accessibility
Target WCAG 2.2 AA principles:
- Keyboard access
- Visible focus
- Correct labels
- Correct semantic elements
- Screen-reader support
- Adequate contrast
- Dialog focus management
- Meaningful validation errors

## Responsive
Test at:
320, 375, 768, 1024, 1280, 1440, 1920 px.
