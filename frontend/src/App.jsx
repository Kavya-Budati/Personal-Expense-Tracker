import ExpensesPage from "./pages/ExpensesPage.jsx";

export default function App() {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <h1>💰 Personal Expense Tracker</h1>
          <p>Record what you spend and see where your money goes.</p>
        </div>
      </header>
      <main className="container">
        <ExpensesPage />
      </main>
    </>
  );
}
