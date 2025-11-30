/**
 * Table Component
 * Responsive data table with striping, hover effects, and accessible markup
 * 
 * @component
 * @example
 * <Table>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeaderCell>Name</Table.HeaderCell>
 *       <Table.HeaderCell>Email</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John</Table.Cell>
 *       <Table.Cell>john@example.com</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * 
 * @param {React.ReactNode} children - Table content
 * @param {boolean} striped - Add alternating row colors (default: true)
 * @param {boolean} hoverable - Add hover effect on rows (default: true)
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
function TableRoot({ children, striped = true, hoverable = true, className = '' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
}

function TableHead({ children, className = '' }) {
  return (
    <thead className={`bg-gray-100 border-b border-gray-300 ${className}`}>{children}</thead>
  );
}

function TableBody({ children, striped = true, className = '' }) {
  return <tbody className={className}>{children}</tbody>;
}

function TableRow({ children, striped = false, hoverable = false, className = '' }) {
  const hoverClass = hoverable ? 'hover:bg-gray-50 transition-colors duration-150' : '';
  const stripeClass = striped ? 'odd:bg-white even:bg-gray-50' : '';
  return <tr className={`border-b border-gray-200 ${hoverClass} ${stripeClass} ${className}`}>{children}</tr>;
}

function TableHeaderCell({ children, className = '' }) {
  return (
    <th className={`px-6 py-3 text-left font-semibold text-gray-900 text-sm ${className}`}>
      {children}
    </th>
  );
}

function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-gray-700 text-sm ${className}`}>{children}</td>
  );
}

TableRoot.Head = TableHead;
TableRoot.Body = TableBody;
TableRoot.Row = TableRow;
TableRoot.HeaderCell = TableHeaderCell;
TableRoot.Cell = TableCell;

export default TableRoot;
