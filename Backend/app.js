const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// Register and Sign-in

app.post('/register', (request, response) => {
    const {username, password, firstname, lastname, salary, age} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.registerUser(username, password, firstname, lastname, salary, age);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// parameterized queries — not subject to SQL injection
app.post('/signin', (request, response) => {
    const {username, password} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.signInUser(username, password);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// --- Justin Tran: add these search routes ---


// Requirement 3: Search users by first and/or last name
app.get('/users/search/name', async (request, response) => {
    const { firstname, lastname } = request.query;

    if (!firstname && !lastname) {
        return response.status(400).json({
            error: "Please provide a first name or last name"
        });
    }

    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersByName(firstname, lastname);

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 4: Search users by User ID
app.get('/users/search/userid/:username', async (request, response) => {
    const { username } = request.params;

    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUserById(username);

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 5: Search users by salary range
app.get('/users/search/salary', async (request, response) => {
    const { min, max } = request.query;

    if (min === undefined || max === undefined ||
        String(min).trim() === '' || String(max).trim() === '' ||
        !Number.isFinite(Number(min)) ||
        !Number.isFinite(Number(max)) ||
        Number(min) < 0 || Number(min) > Number(max)) {
        return response.status(400).json({
            error: "Please provide a valid minimum and maximum salary"
        });
    }

    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersBySalary(Number(min), Number(max));

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 6: Search users by age range
app.get('/users/search/age', async (request, response) => {
    const { min, max } = request.query;

    if (min === undefined || max === undefined ||
        String(min).trim() === '' || String(max).trim() === '' ||
        !Number.isInteger(Number(min)) ||
        !Number.isInteger(Number(max)) ||
        Number(min) < 0 || Number(min) > Number(max)) {
        return response.status(400).json({
            error: "Please provide a valid minimum and maximum age"
        });
    }

    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersByAge(Number(min), Number(max));

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 7: Search users registered after a specific user
app.get('/users/search/after/:userid', async (request, response) => {
    const { userid } = request.params;

    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersRegisteredAfter(userid);

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 8: Search users who never signed in
app.get('/users/search/never-signed-in', async (request, response) => {
    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersNeverSignedIn();

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 9: Search users registered on the same day
app.get('/users/search/same-day/:userid', async (request, response) => {
    const { userid } = request.params;

    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersSameDayAs(userid);

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

// Requirement 10: Search users registered today
app.get('/users/search/today', async (request, response) => {
    try {
        const db = dbService.getDbServiceInstance();
        const results = await db.searchUsersRegisteredToday();

        if (results.error) {
            return response.status(500).json(results);
        }

        response.json({ data: results });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

app.listen(5050,
    () => {
        console.log("Listening on port 5050.")
    }
);
