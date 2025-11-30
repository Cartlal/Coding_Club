/**
 * Skeleton Loader Component
 * Animated placeholder for loading states
 * 
 * @component
 * @example
 * <Skeleton />
 * <Skeleton variant="card" />
 * <Skeleton variant="text" count={3} />
 * 
 * @param {string} variant - 'default' | 'text' | 'circle' | 'card' | 'button'
 * @param {number} count - Number of skeleton elements to render
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
export default function Skeleton({
  variant = 'default',
  count = 1,
  className = '',
}) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variants = {
    default: `${baseStyles} h-6 w-full rounded-lg`,
    text: `${baseStyles} h-4 w-full rounded-lg`,
    circle: `${baseStyles} w-12 h-12 rounded-full`,
    card: `${baseStyles} h-64 w-full rounded-lg`,
    button: `${baseStyles} h-10 w-24 rounded-lg`,
    thumbnail: `${baseStyles} h-32 w-32 rounded-lg`,
  };

  const skeletons = Array(count)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className={`${variants[variant] || variants.default} ${
          count > 1 && index < count - 1 ? 'mb-2' : ''
        } ${className}`}
      />
    ));

  return <>{skeletons}</>;
}

/**
 * Skeleton components for common patterns
 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded-t-lg"></div>
      <div className="p-6 space-y-4">
        <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded-lg"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-lg"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-5/6 rounded-lg"></div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 h-10 w-full rounded-lg mt-4"></div>
      </div>
    </div>
  );
}

export function SkeletonEventCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 h-5 w-full rounded-lg"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-lg"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-4/5 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-16 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-20 rounded-full"></div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 h-10 w-full rounded-lg"></div>
      </div>
    </div>
  );
}

export function SkeletonMemberCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 h-5 w-3/4 rounded-lg"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-12 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-14 rounded-full"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-16 rounded-full"></div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-lg"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-12 rounded-lg"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded-lg"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 flex-1 rounded-lg"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-20 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="bg-gray-200 dark:bg-gray-700 h-12 w-12 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded-lg"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
