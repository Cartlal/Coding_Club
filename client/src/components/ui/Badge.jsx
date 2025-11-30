/**
 * Badge Component
 * Small status indicator or label component
 * 
 * @component
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="lg">Pending</Badge>
 * 
 * @param {React.ReactNode} children - Badge content
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' (default: 'primary')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} outlined - Show outline style instead of filled
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  outlined = false,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-200';

  const variants = {
    primary: outlined
      ? 'bg-blue-50 text-primary border border-primary'
      : 'bg-blue-100 text-primary',
    secondary: outlined
      ? 'bg-indigo-50 text-secondary border border-secondary'
      : 'bg-indigo-100 text-secondary',
    success: outlined
      ? 'bg-green-50 text-green-700 border border-green-600'
      : 'bg-green-100 text-green-800',
    warning: outlined
      ? 'bg-yellow-50 text-yellow-700 border border-yellow-600'
      : 'bg-yellow-100 text-yellow-800',
    danger: outlined
      ? 'bg-red-50 text-red-700 border border-red-600'
      : 'bg-red-100 text-red-800',
    info: outlined
      ? 'bg-cyan-50 text-cyan-700 border border-cyan-600'
      : 'bg-cyan-100 text-cyan-800',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
