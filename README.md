# CSC4710 Project 1 – User Registration and Search

A web app for registering users, signing in, and searching users. It has three parts:

- **Frontend**: HTML, CSS, and JavaScript (`Frontend/`), served by Apache (XAMPP)
- **Backend**: Node.js + Express REST API on port 5050 (`Backend/`)
- **Database**: MySQL / XAMPP, schema and queries in `sql.txt`

**Team members:** Jordan Luong, Justin Tran

---

## 1. Prerequisites

Install these first:

| Software | Version | Download |
|---|---|---|
| XAMPP (Apache + MySQL) | 8.x | https://www.apachefriends.org |
| Node.js (includes npm) | 18 or newer | https://nodejs.org |

---

## 2. Project Layout

```
Project1/
├── Backend/
│   ├── app.js            # Express server and API routes
│   ├── dbService.js      # MySQL connection and query methods
│   ├── dotenv_example    # Template for the .env config file
│   └── package.json      # Node dependencies
├── Frontend/
│   ├── index.html        # UI page
│   ├── index.js          # Calls the backend API
│   └── stylesheet.css    # Styles
├── sql.txt               # All SQL statements used in this project
└── README.md
```

---

## 3. Deploy

### Step 1: Put the project in the XAMPP web folder

Copy the `Project1` folder into the XAMPP `htdocs` directory:

```
C:\xampp\htdocs\Project1
```

### Step 2: Start Apache and MySQL

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache** and next to **MySQL**.

### Step 3: Create the database and table

1. Open phpMyAdmin at http://localhost/phpmyadmin.
2. Click **New** and create a database named `web_app`.
3. Select `web_app`, open the **SQL** tab, and run the `CREATE TABLE Users ...` statement from the top of `sql.txt`:

```sql
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    salary FLOAT,
    age INTEGER,
    registerday DATE,
    signintime DATETIME
);
```

> The other statements in `sql.txt` use `?` placeholders. They are the parameterized queries the backend runs, so do **not** run them by hand.

### Step 4: Configure the backend

In the `Backend` folder, copy `dotenv_example` to a new file named `.env`:

```bash
cd C:\xampp\htdocs\Project1\Backend
copy dotenv_example .env
```

Edit `.env` if your MySQL settings differ from the XAMPP defaults:

```
PORT=5050
DB_USER=root
PASSWORD=
DATABASE=web_app
DB_PORT=3306
HOST=localhost
```

---

## 4. Compile (Install Dependencies)

JavaScript does not need to be compiled. The build step is installing the Node packages (`express`, `mysql`, `bcrypt`, `cors`, `dotenv`, `nodemon`):

```bash
cd C:\xampp\htdocs\Project1\Backend
npm install
```

This creates the `node_modules/` folder.

---

## 5. Run

### Step 1: Start the backend server

```bash
cd C:\xampp\htdocs\Project1\Backend
npm start
```

The terminal should show:

```
Listening on port 5050.
db connected
```

If it shows `db disconnected` or an error, make sure MySQL is running in XAMPP and that the values in `.env` are correct.

Leave this terminal open while you use the app.

### Step 2: Open the frontend

With Apache running, go to:

http://localhost/Project1/Frontend/index.html

### Step 3: Use the app

1. **Register:** fill in username, password, first name, last name, salary, and age, then click **Register**. The password is hashed with bcrypt before it is stored.
2. **Sign in:** enter a registered username and password, then click **Sign In**. This records the sign-in time.
3. **Search:** each search button fills in the results table:
   - Search by first and/or last name
   - Search by userid (username)
   - Search by salary range
   - Search by age range
   - Users registered after a given userid
   - Users who have never signed in
   - Users registered on the same day as a given userid
   - Users registered today

---

## 6. API Endpoints

All endpoints are at `http://localhost:5050`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/signin` | Sign in and update the sign-in time |
| GET | `/users/search/name?firstname=&lastname=` | Search by first and/or last name |
| GET | `/users/search/userid/:username` | Search by userid |
| GET | `/users/search/salary?min=&max=` | Search by salary range |
| GET | `/users/search/age?min=&max=` | Search by age range |
| GET | `/users/search/after/:userid` | Users registered after a user |
| GET | `/users/search/never-signed-in` | Users who have never signed in |
| GET | `/users/search/same-day/:userid` | Users registered on the same day as a user |
| GET | `/users/search/today` | Users registered today |

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `Error: Cannot find module ...` | Run `npm install` in the `Backend` folder. |
| `ER_BAD_DB_ERROR` | Create the `web_app` database (Deploy, Step 3). |
| `ER_NO_SUCH_TABLE` | Run the `CREATE TABLE Users` statement (Deploy, Step 3). |
| `ECONNREFUSED` on port 3306 | Start MySQL in the XAMPP Control Panel. |
| `EADDRINUSE` on port 5050 | Another process is using port 5050. Close it or the other backend terminal. |
| Buttons do nothing | Make sure the backend terminal is running, and check the browser console (F12). |
