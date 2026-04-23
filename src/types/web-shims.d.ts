// Lightweight shims for web-only libraries used in the `components/` folder.
// Replace these with proper type packages or more specific declarations as needed.
declare module 'lucide-react';
declare module 'class-variance-authority' {
	export function cva(base?: string | string[], opts?: any): (...args: any[]) => string
	export type VariantProps<T = any> = Record<string, any>
}
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

declare module 'embla-carousel-react' {
	export type UseEmblaCarouselType = any
	const createEmbla: any
	export default createEmbla
}

declare module 'sonner' {
	export type ToasterProps = any
	export const Toaster: any
	export const toast: any
}
declare module 'recharts' {
	export type LegendProps = any
	export const Legend: any
	export const Tooltip: any
	export const ResponsiveContainer: any
	export const LineChart: any
	export const Line: any
}

declare module 'input-otp' {
	export const OTPInput: any
	export const OTPInputContext: any
}

declare module 'react-hook-form' {
	export type FieldValues = any
	export type FieldPath<T = any> = any
	export type ControllerProps<T = any> = any
	export type UseControllerProps<T = any> = any
	export const Controller: any
}
declare module 'react-resizable-panels';
declare module 'embla-carousel-react';
declare module 'recharts';
declare module 'cmdk';
declare module 'vaul';
declare module 'sonner';
declare module 'input-otp';
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
