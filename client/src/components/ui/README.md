# UI Components Documentation

This directory contains reusable, accessible, and fully responsive UI components built with React and Tailwind CSS.

## Components Overview

### Button
Flexible button component with multiple variants, sizes, and states.

**Props:**
- `children` (ReactNode) - Button content
- `variant` ('primary' | 'secondary' | 'success' | 'danger' | 'ghost') - default: 'primary'
- `size` ('sm' | 'md' | 'lg') - default: 'md'
- `disabled` (boolean) - Disable button
- `isLoading` (boolean) - Show loading state
- `fullWidth` (boolean) - Make button full width
- `icon` (ReactNode) - Optional icon
- `className` (string) - Additional CSS classes

**Example:**
```jsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg" fullWidth>
  Click Me
</Button>

<Button variant="danger" isLoading>
  Processing...
</Button>
```

---

### Card
Flexible container component for organizing content with optional header, body, and footer sections.

**Props:**
- `children` (ReactNode) - Card content
- `variant` ('default' | 'elevated' | 'outlined') - default: 'default'
- `interactive` (boolean) - Enable hover effects
- `className` (string) - Additional CSS classes

**Subcomponents:**
- `Card.Header` - Header section with border
- `Card.Body` - Main content area
- `Card.Footer` - Footer section with border

**Example:**
```jsx
import { Card } from '@/components/ui';

<Card variant="elevated">
  <Card.Header>
    <h2>Card Title</h2>
  </Card.Header>
  <Card.Body>
    Card content goes here
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

### Badge
Small status indicator or label component with multiple styling variants.

**Props:**
- `children` (ReactNode) - Badge content
- `variant` ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info') - default: 'primary'
- `size` ('sm' | 'md' | 'lg') - default: 'md'
- `outlined` (boolean) - Use outline style instead of filled
- `className` (string) - Additional CSS classes

**Example:**
```jsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning" outlined>Pending</Badge>
<Badge variant="danger" size="lg">Critical</Badge>
```

---

### Input
Text input field with validation states, labels, and helper text.

**Props:**
- `type` (string) - HTML input type - default: 'text'
- `placeholder` (string) - Placeholder text
- `label` (string) - Label above input
- `error` (string) - Error message
- `helpText` (string) - Helper text below input
- `required` (boolean) - Mark as required
- `disabled` (boolean) - Disable input
- `size` ('sm' | 'md' | 'lg') - default: 'md'
- `variant` ('default' | 'ghost') - default: 'default'
- `icon` (ReactNode) - Optional icon inside input
- `className` (string) - Additional CSS classes

**Example:**
```jsx
import { Input } from '@/components/ui';

<Input
  type="email"
  label="Email Address"
  placeholder="your@email.com"
  required
/>

<Input
  type="password"
  label="Password"
  error="Password too short"
  helpText="Minimum 8 characters"
/>
```

---

### Table
Responsive data table with striping, hover effects, and accessible markup.

**Props:**
- `children` (ReactNode) - Table content
- `striped` (boolean) - Alternating row colors - default: true
- `hoverable` (boolean) - Hover effects on rows - default: true
- `className` (string) - Additional CSS classes

**Subcomponents:**
- `Table.Head` - Table header
- `Table.Body` - Table body
- `Table.Row` - Table row
- `Table.HeaderCell` - Header cell
- `Table.Cell` - Data cell

**Example:**
```jsx
import { Table } from '@/components/ui';

<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Email</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
      <Table.Cell><Badge variant="success">Active</Badge></Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

---

### Modal
Accessible dialog overlay with backdrop and animations.

**Props:**
- `isOpen` (boolean) - Control modal visibility
- `onClose` (Function) - Callback when modal should close
- `children` (ReactNode) - Modal content
- `size` ('sm' | 'md' | 'lg' | 'xl') - default: 'md'
- `closeOnBackdropClick` (boolean) - Close when clicking backdrop - default: true
- `className` (string) - Additional CSS classes

**Subcomponents:**
- `Modal.Header` - Header with optional close button
- `Modal.Body` - Main content area
- `Modal.Footer` - Footer for action buttons

**Example:**
```jsx
import { Modal, Button } from '@/components/ui';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        <Modal.Header onClose={() => setIsOpen(false)}>
          <h2>Confirm Action</h2>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to proceed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setIsOpen(false)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

---

### SearchBar
Search input with optional suggestions dropdown and loading state.

**Props:**
- `placeholder` (string) - Placeholder text - default: 'Search...'
- `onSearch` (Function) - Callback when search value changes
- `onSubmit` (Function) - Callback when form is submitted
- `suggestions` (Array) - Array of suggested items
- `isLoading` (boolean) - Show loading state
- `clearable` (boolean) - Show clear button - default: true
- `size` ('sm' | 'md' | 'lg') - default: 'md'
- `className` (string) - Additional CSS classes

**Example:**
```jsx
import { SearchBar } from '@/components/ui';
import { useState } from 'react';

function EventSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  return (
    <SearchBar
      placeholder="Search events..."
      onSearch={(q) => setQuery(q)}
      onSubmit={(q) => {
        // Fetch results for query
        setResults([...]);
      }}
      suggestions={['Web Dev', 'AI Workshop', 'Hackathon']}
    />
  );
}
```

---

## Accessibility Features

All components are built with accessibility in mind:

- **Semantic HTML** - Proper use of HTML elements
- **ARIA Labels** - Accessible labels and descriptions
- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Visible focus indicators
- **Color Contrast** - WCAG AA compliant colors
- **Touch Targets** - Minimum 44x44px for interactive elements

## Design Consistency

All components follow these design principles:

- **Consistent Spacing** - Uses Tailwind's spacing scale
- **Unified Colors** - Primary, secondary, success, warning, danger, info
- **Smooth Transitions** - 200ms duration animations
- **Responsive Design** - Mobile-first approach
- **Visual Hierarchy** - Clear typography scale

## Responsive Breakpoints

Components are responsive across all breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Usage Tips

1. **Import from index** - Always import from `@/components/ui` for cleaner imports
2. **Extend components** - Use `className` prop to extend styles
3. **Composition** - Combine components for complex layouts
4. **Prop spreading** - Most components accept `...props` for additional HTML attributes
5. **Type safety** - Consider adding TypeScript for better prop validation

## Color Variants Reference

- **Primary**: Blue (#2563eb) - Main brand color
- **Secondary**: Dark Blue (#1e40af) - Secondary actions
- **Success**: Green (#16a34a) - Positive actions
- **Warning**: Yellow (#ca8a04) - Attention needed
- **Danger**: Red (#dc2626) - Destructive actions
- **Info**: Cyan (#06b6d4) - Informational

## Contributing

When adding new components:

1. Follow the same structure and naming conventions
2. Include comprehensive JSDoc comments
3. Implement all accessibility features
4. Add responsive design consideration
5. Export from `index.js`
6. Document in this README
