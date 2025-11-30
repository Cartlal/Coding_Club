import { useState } from 'react';

/**
 * Modal Component
 * Accessible dialog overlay with backdrop and animations
 * 
 * @component
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>Title</Modal.Header>
 *   <Modal.Body>Content</Modal.Body>
 *   <Modal.Footer>Buttons</Modal.Footer>
 * </Modal>
 * 
 * @param {boolean} isOpen - Control modal open/closed state
 * @param {Function} onClose - Callback when modal should close
 * @param {React.ReactNode} children - Modal content
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * @param {boolean} closeOnBackdropClick - Close when clicking backdrop (default: true)
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
function ModalRoot({ isOpen, onClose, children, size = 'md', closeOnBackdropClick = true, className = '' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg shadow-2xl max-w-full ${sizes[size]} w-full transform transition-all duration-200 ${className}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

function ModalHeader({ children, className = '', onClose = null }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${className}`}>
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function ModalBody({ children, className = '' }) {
  return <div className={`px-6 py-6 ${className}`}>{children}</div>;
}

function ModalFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}

ModalRoot.Header = ModalHeader;
ModalRoot.Body = ModalBody;
ModalRoot.Footer = ModalFooter;

export default ModalRoot;
