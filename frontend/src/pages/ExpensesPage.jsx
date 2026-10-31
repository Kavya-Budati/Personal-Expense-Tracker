import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../api/client";
import { createExpense, deleteExpense, fetchExpenses, fetchSummary, updateExpense } from "../api/expenseApi";
import ExpenseForm, { CATEGORIES } from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";
import Notice from "../components/Notice.jsx";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([fetchExpenses(filter), fetchSummary(filter)]);
      setExpenses(list);
      setSummary(sum);
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await updateExpense(editing.id, data);
        setNotice({ type: "success", text: "Expense updated successfully" });
        setEditing(null);
      } else {
        await createExpense(data);
        setNotice({ type: "success", text: "Expense added successfully" });
      }
      await load();
      return true;
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e) => {
    if (!window.confirm(`Delete "${e.title}"?`)) return;
    try {
      await deleteExpense(e.id);
      setNotice({ type: "success", text: "Expense deleted" });
      if (editing?.id === e.id) setEditing(null);
      await load();
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
    }
  };

  return (
    <>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="grid" style={{ marginBottom: 18 }}>
        <div className="stat"><div className="label">Total spent (all)</div><div className="value">{money(summary?.grandTotal)}</div></div>
        <div className="stat"><div className="label">{filter ? "Filtered total" : "Expenses recorded"}</div><div className="value">{filter ? money(summary?.total) : summary?.count ?? 0}</div></div>
        {CATEGORIES.map((c) => (
          <div className="stat" key={c.value}><div className="label">{c.label}</div><div className="value">{money(summary?.byCategory?.[c.value])}</div></div>
        ))}
      </div>

      <section className="card">
        <h2>{editing ? "Edit expense" : "Add expense"}</h2>
        <ExpenseForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} saving={saving} />
      </section>

      <section className="card">
        <div className="toolbar">
          <h2 style={{ margin: 0 }}>Expenses</h2>
          <span className="spacer" />
          <label htmlFor="filter" className="muted">Filter by category</label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {loading ? <div className="loading">Loading expenses…</div> :
          <ExpenseTable expenses={expenses} onEdit={(e) => { setEditing(e); window.scrollTo({ top: 0, behavior: "smooth" }); }} onDelete={handleDelete} />}
      </section>
    </>
  );
}
