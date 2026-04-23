// Lightweight shims for web-only libraries used in the `components/` folder.
// Where packages provide built-in types, prefer those (installed as devDependencies).
// Keep narrow shims only for modules that still lack types in node_modules.
declare module '@radix-ui/react-alert-dialog'
declare module '@radix-ui/react-aspect-ratio'
declare module '@radix-ui/react-avatar'
declare module '@radix-ui/react-slot'
declare module '@radix-ui/react-collapsible'
declare module '@radix-ui/react-context-menu'
declare module '@radix-ui/react-label'
declare module '@radix-ui/react-hover-card'
declare module '@radix-ui/react-menubar'
declare module '@radix-ui/react-navigation-menu'
declare module '@radix-ui/react-progress'
declare module '@radix-ui/react-switch'
declare module '@radix-ui/react-toast'
declare module '@radix-ui/react-toggle-group'
declare module '@radix-ui/react-slot'

declare module 'react-day-picker'
declare module 'react-hook-form'

// embla-carousel-react provides its own types (devDependency installed).

// sonner provides types via its package (devDependency installed).
// recharts types are provided by the package or @types/recharts (devDependency installed).

// input-otp installed as a devDependency; prefer package types if present.

// react-hook-form includes its own types (devDependency installed).
declare module 'react-resizable-panels';
declare module 'cmdk';
declare module 'vaul';
declare module 'next-themes';
declare module '@radix-ui/react-dialog';
declare module '@radix-ui/react-popover';
declare module '@radix-ui/react-toggle';
declare module '@radix-ui/react-tooltip';
declare module '@radix-ui/react-dropdown-menu';
declare module '@radix-ui/react-tabs';
declare module '@radix-ui/react-slider';
declare module '@radix-ui/react-scroll-area';
declare module '@radix-ui/react-separator';
declare module '@radix-ui/react-accordion';
declare module '@radix-ui/react-checkbox';
declare module '@radix-ui/react-radio-group';
declare module '@radix-ui/react-select';
