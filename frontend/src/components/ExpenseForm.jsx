import { useEffect, useState } from "react";

export const CATEGORIES = [
  { value: "FOOD", label: "Food" },
  { value: "TRAVEL", label: "Travel" },
  { value: "SHOPPING", label: "Shopping" },
  { value: "OTHER", label: "Other" },
];

const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const empty = () => ({ title: "", amount: "", category: "FOOD", date: today() });

export default function ExpenseForm({ editing, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(empty());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    setForm(editing ? { title: editing.title, amount: editing.amount, category: editing.category, date: editing.expenseDate } : empty());
  }, [editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Title is required";
    if (form.amount === "" || Number(form.amount) <= 0) err.amount = "Amount must be greater than 0";
    if (!form.date) err.date = "Date is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onSubmit({ title: form.title.trim(), amount: Number(form.amount), category: form.category, date: form.date });
    if (ok && !editing) setForm(empty());
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid-form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={change} placeholder="e.g. Lunch" />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>
        <div className="field">
          <label htmlFor="amount">Amount (₹)</label>
          <input id="amount" name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={change} />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={change}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={form.date} onChange={change} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>
      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn" disabled={saving}>{editing ? "Update Expense" : "Add Expense"}</button>
        {editing && <button type="button" className="btn secondary" onClick={onCancel}>Cancel edit</button>}
      </div>
    </form>
  );
}
