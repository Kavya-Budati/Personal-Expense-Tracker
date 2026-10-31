# Personal Expense Tracker

A web application to record everyday expenses, review them by category and see the total amount spent.

> Stack: **React 18 (Vite) + Axios** · **Java 17 + Spring Boot 3.3.5 (Spring Web, Spring Data JPA/Hibernate, Bean Validation)** · **MySQL 8.x** · Maven

## 1. Problem statement (summary)

Record each expense (title, amount, category, date), list/edit/delete them, show the total spent and filter the list by category. Data must persist in a database through Spring Boot REST APIs; empty titles and amounts <= 0 are rejected.

## 2. Features implemented

- Add an expense with title, amount, category (Food / Travel / Shopping / Other) and date
- Table of saved expenses (newest first) with all details
- Edit and delete expenses (with confirmation)
- Total amount spent across all expenses plus a per-category breakdown
- Filter by category with a filtered total
- Success / error messages, loading and empty states, client + server validation

## 3. Technologies and versions

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5.4, Axios 1.7, plain CSS (responsive) |
| Backend | Java 17, Spring Boot 3.3.5, Spring Web, Spring Data JPA (Hibernate 6), Jakarta Bean Validation, Maven |
| Database | MySQL 8.x with MySQL Connector/J (managed by Spring Boot) |

## 4. Prerequisites

- JDK 17 or newer (`java -version`) and Maven 3.8+ (`mvn -version`) - or use IntelliJ IDEA's bundled Maven
- Node.js 18+ and npm (`node -v`, `npm -v`)
- MySQL Server 8.x **installed and running** on `localhost:3306`
- A MySQL user (for example `root`) that has privileges on database `personal_expense_tracker`
- VS Code or IntelliJ IDEA

## 5. Folder structure

```
01-Personal-Expense-Tracker/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── tt/
│   │       │           └── expensetracker/
│   │       │               ├── config/
│   │       │               │   └── CorsConfig.java
│   │       │               ├── controller/
│   │       │               │   └── ExpenseController.java
│   │       │               ├── dto/
│   │       │               │   ├── ExpenseRequest.java
│   │       │               │   └── ExpenseSummary.java
│   │       │               ├── entity/
│   │       │               │   ├── Category.java
│   │       │               │   └── Expense.java
│   │       │               ├── exception/
│   │       │               │   ├── BadRequestException.java
│   │       │               │   ├── ConflictException.java
│   │       │               │   ├── GlobalExceptionHandler.java
│   │       │               │   └── NotFoundException.java
│   │       │               ├── repository/
│   │       │               │   └── ExpenseRepository.java
│   │       │               ├── service/
│   │       │               │   └── ExpenseService.java
│   │       │               └── ExpenseTrackerApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── .gitignore
│   └── pom.xml
├── database/
│   ├── sample-data.sql
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── expenseApi.js
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   └── Notice.jsx
│   │   ├── pages/
│   │   │   └── ExpensesPage.jsx
│   │   ├── styles/
│   │   │   └── app.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 6. MySQL setup

1. Make sure MySQL Server is running (Windows: *Services → MySQL80 → Start*; Linux: `sudo systemctl start mysql`; macOS: `brew services start mysql`).
2. This project uses its **own database**: `personal_expense_tracker`.
3. Create it **before starting the backend** (Hibernate creates tables, but not the database):

```sql
CREATE DATABASE IF NOT EXISTS personal_expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the ready-made script: `mysql -u root -p < database/schema.sql` (or open `database/schema.sql` in MySQL Workbench and execute it).

4. Tables are then created/updated automatically on the first backend start because `spring.jpa.hibernate.ddl-auto=update`. No SQL table scripts are executed by Spring (there is no `schema.sql` inside the backend), so the two strategies never conflict.

## 7. Configure `application.properties`

Open `backend/src/main/resources/application.properties` and change only these lines:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/personal_expense_tracker?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

- **Database name** → the word after `3306/` (keep `personal_expense_tracker` unless you created a different name).
- **Host / port** → `localhost:3306` (change if MySQL runs elsewhere or on another port).
- **Username / password** → your own MySQL credentials. Replace `YOUR_MYSQL_PASSWORD` with your real password (leave it empty if your root user has no password).
- No credentials are stored in Java code, and no environment variables are needed.

## 8. Run the backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

(or run `ExpenseTrackerApplication` from IntelliJ IDEA / VS Code). When you see `Started ExpenseTrackerApplication`, the API is live at **http://localhost:8080**.

## 9. Run the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Production build check: `npm run build`.

The API base URL is set in `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Change it only if the backend uses another host/port. Restart `npm run dev` after editing `.env`. CORS for `http://localhost:5173` is configured in `config/CorsConfig.java`.

## 10. REST API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | List expenses (newest first); optional filter ?category=FOOD|TRAVEL|SHOPPING|OTHER |
| GET | `/api/expenses/summary` | Total spent, number of expenses and per-category totals (optional ?category= filter) |
| GET | `/api/expenses/{id}` | Get one expense by id |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/{id}` | Update an existing expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

Errors are returned as JSON: `{ "timestamp", "status", "message", "errors": { "field": "message" } }` with HTTP 400 (validation), 404 (not found) or 409 (conflict/duplicate).

## 11. How to test the main features manually

1. Add an expense: title `Lunch`, amount `120`, category Food, today's date → success banner and a new row; totals update.
2. Try amount `0` or an empty title → error message, nothing saved.
3. Click **Edit** on a row, change the amount, press **Update Expense** → row changes.
4. Select a category in the filter → only that category is listed and the *Filtered total* shows its sum.
5. Click **Delete** and confirm → row disappears and the total decreases.
6. Refresh the browser or restart the backend → the data is still there (stored in MySQL).

## 12. Validation rules and business logic

- Title: required, not blank, max 120 characters
- Amount: required, greater than 0 (min 0.01), at most 2 decimal places
- Category: must be FOOD, TRAVEL, SHOPPING or OTHER
- Date: required (`yyyy-MM-dd`)
- Totals are calculated in MySQL with `SUM` (JPQL), not in the browser
- Invalid input returns HTTP 400 with a field-wise message

## 13. Sample data

Optional sample rows are provided in `database/sample-data.sql`. Start the backend once first (so Hibernate creates the tables), then run: `mysql -u root -p < database/sample-data.sql`.

## 14. Common errors and solutions

| Problem | Solution |
|---|---|
| `Access denied for user 'root'@'localhost'` | Wrong username/password in `application.properties`. Test with `mysql -u root -p`. |
| `Unknown database 'personal_expense_tracker'` | Create it first: `CREATE DATABASE personal_expense_tracker;` (see section 6). |
| `Communications link failure` / `Connection refused` | MySQL is not running or uses a different port. Start MySQL and check the port in the JDBC URL. |
| `Port 8080 was already in use` | Stop the other program or set `server.port=8081` in `application.properties` **and** `VITE_API_BASE_URL=http://localhost:8081/api` in `frontend/.env`. |
| Port 5173 busy | Vite automatically picks 5174; then add that origin to `CorsConfig.java`, or free port 5173. |
| `Public Key Retrieval is not allowed` | Keep `allowPublicKeyRetrieval=true` in the JDBC URL (already included). |
| Browser shows "Cannot reach the backend" | Backend is not running, or `VITE_API_BASE_URL` is wrong. Open `http://localhost:8080/api/...` in the browser to check. |
| CORS error in browser console | Frontend is running on an origin other than 5173/4173; add it in `CorsConfig.java`. |
| `npm install` fails | Check the Node version (18+) and your internet connection. |


## 15. MySQL connection troubleshooting checklist

1. `mysql -u root -p` works from a terminal? If not, fix the password/service first.
2. `SHOW DATABASES;` lists `personal_expense_tracker`? If not, create it.
3. `SHOW GRANTS FOR 'root'@'localhost';` shows privileges on `personal_expense_tracker`? If you use another user, `GRANT ALL PRIVILEGES ON personal_expense_tracker.* TO 'user'@'localhost';`.
4. `SHOW VARIABLES LIKE 'port';` equals the port in the JDBC URL?
5. Special characters in the password are fine in `.properties`; do not wrap the password in quotes.
6. Read the **first** "Caused by:" line of the Spring Boot stack trace - it names the real MySQL problem.

## 16. How React, Spring Boot, REST, JPA and MySQL work together

1. The **React** component calls an **Axios** function (`src/api/client.js`) such as `api.get("/...")`.
2. Axios sends an HTTP request (JSON) to the **Spring Boot** REST controller in `controller/`.
3. The controller validates input (`@Valid`) and delegates to a **service** that holds the business rules.
4. The service uses a **Spring Data JPA repository**; **Hibernate** converts entity objects to SQL.
5. **MySQL** stores the rows permanently; the result travels back as JSON and React re-renders the screen.

## 17. Viva preparation

**Q1. Why is the total calculated in the backend?**  
SQL `SUM` is authoritative and efficient; the UI only displays it, so it stays correct even if the list is filtered or paged.

**Q2. Why `BigDecimal` for amount?**  
`double` has rounding errors; `BigDecimal` with `DECIMAL(12,2)` gives exact money values.

**Q3. What does `@Valid` do?**  
It triggers Jakarta Bean Validation on the request DTO; failures raise `MethodArgumentNotValidException`, handled by `GlobalExceptionHandler` as HTTP 400.

**Q4. Which HTTP verbs are used and why?**  
GET reads, POST creates (201), PUT updates, DELETE removes (204).

**Q5. How does the category filter work?**  
`GET /api/expenses?category=FOOD` is bound to the `Category` enum and calls `findByCategory…` in the repository.

**Q6. What is `ddl-auto=update`?**  
Hibernate compares entities with the schema and creates/alters tables without dropping data.

**Q7. Why a DTO (`ExpenseRequest`) instead of the entity?**  
It limits what the client can send (no id injection) and keeps validation rules separate from persistence.

**Q8. What is CORS and where is it configured?**  
Browsers block calls between origins (5173 → 8080) unless the server allows it; `CorsConfig` allows the Vite origin.

**Q9. How do you enable edit mode in React?**  
The selected expense is stored in `editing` state; the form's `useEffect` fills its fields and submit calls PUT instead of POST.
