-- Personal Expense Tracker : OPTIONAL sample data
-- Run AFTER the backend has started once (so Hibernate has created the tables).
USE personal_expense_tracker;

INSERT INTO expenses (title, amount, category, expense_date) VALUES
('Lunch at canteen', 120.00, 'FOOD', CURDATE()),
('Bus pass', 450.00, 'TRAVEL', CURDATE()),
('Notebook and pens', 260.50, 'SHOPPING', CURDATE()),
('Mobile recharge', 299.00, 'OTHER', CURDATE());
