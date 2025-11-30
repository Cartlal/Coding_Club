/**
 * Button Component
 * Reusable button with multiple variants, sizes, and states
 * 
 * @component
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * // With routing
 * <Button as={Link} to="/events">Go to Events</Button>
 * 
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' (default: 'primary')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} disabled - Disable button state
 * @param {boolean} isLoading - Show loading state
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {boolean} fullWidth - Make button full width
 * @param {React.ElementType} as - Component to render as (default: 'button')
 * @returns {JSX.Element}
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
  icon = null,
  fullWidth = false,
  as: Component = 'button',
  ...props
}) {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed inline-flex';

  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-blue-900 focus:ring-secondary',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary border border-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full justify-center' : '';

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {isLoading ? 'Loading...' : children}
    </Component>
  );
}
