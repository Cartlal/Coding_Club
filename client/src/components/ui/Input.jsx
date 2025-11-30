/**
 * Input Component
 * Flexible input field with variants, validation states, and helper text
 * 
 * @component
 * @example
 * <Input 
 *   type="email" 
 *   placeholder="Enter email"
 *   label="Email Address"
 *   error="Invalid email"
 * />
 * 
 * @param {string} type - Input type ('text', 'email', 'password', 'number', 'date', etc. - default: 'text')
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Label text above input
 * @param {string} error - Error message to display
 * @param {string} helpText - Helper text below input
 * @param {boolean} required - Mark field as required
 * @param {boolean} disabled - Disable input
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} icon - Optional icon to display inside input
 * @param {string} variant - 'default' | 'ghost' (default: 'default')
 * @returns {JSX.Element}
 */
export default function Input({
  type = 'text',
  placeholder = '',
  label = '',
  error = '',
  helpText = '',
  required = false,
  disabled = false,
  size = 'md',
  className = '',
  icon = null,
  variant = 'default',
  ...props
}) {
  const baseStyles =
    'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variants = {
    default: error
      ? 'border-2 border-red-500 rounded-lg focus:ring-red-500 focus:border-red-500'
      : 'border border-gray-300 rounded-lg focus:ring-primary focus:border-primary',
    ghost: 'bg-gray-100 border-0 rounded-lg focus:ring-primary hover:bg-gray-200',
  };

  const iconClass = icon ? 'relative' : '';
  const paddingClass = icon ? (size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10') : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={iconClass}>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${paddingClass} ${className}`}
          {...props}
        />
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
      </div>

      {error && <p className="text-red-600 text-sm mt-1.5">{error}</p>}
      {helpText && !error && <p className="text-gray-500 text-sm mt-1.5">{helpText}</p>}
    </div>
  );
}
