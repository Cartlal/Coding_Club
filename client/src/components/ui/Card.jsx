/**
 * Card Component
 * Flexible container component for content with optional header and footer
 * 
 * @component
 * @example
 * // Basic usage
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} variant - 'default' | 'elevated' | 'outlined' (default: 'default')
 * @param {string} className - Additional CSS classes
 * @param {boolean} interactive - Enable hover effects
 * @returns {JSX.Element}
 */
function CardRoot({ children, variant = 'default', className = '', interactive = false }) {
  const baseStyles = 'rounded-lg overflow-hidden transition-all duration-200';

  const variants = {
    default: 'bg-white shadow-md',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    outlined: 'bg-white border border-gray-200',
  };

  const interactiveClass = interactive ? 'cursor-pointer hover:shadow-lg' : '';

  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactiveClass} ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
  );
}

function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}

CardRoot.Header = CardHeader;
CardRoot.Body = CardBody;
CardRoot.Footer = CardFooter;

export default CardRoot;
