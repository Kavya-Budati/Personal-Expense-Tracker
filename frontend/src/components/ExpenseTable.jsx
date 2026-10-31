import { CATEGORIES } from "./ExpenseForm.jsx";

const label = (v) => CATEGORIES.find((c) => c.value === v)?.label || v;
const money = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) return <div className="empty">No expenses found. Add your first expense above.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Date</th><th>Title</th><th>Category</th><th className="num">Amount</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.expenseDate}</td>
              <td>{e.title}</td>
              <td><span className="badge blue">{label(e.category)}</span></td>
              <td className="num">{money(e.amount)}</td>
              <td className="btn-row">
                <button className="btn small secondary" onClick={() => onEdit(e)}>Edit</button>
                <button className="btn small danger" onClick={() => onDelete(e)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
