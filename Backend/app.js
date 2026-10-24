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
// GET /users/search/name?firstname=&lastname=
// GET /users/search/userid/:username
// GET /users/search/salary?min=&max=
// GET /users/search/age?min=&max=
// GET /users/search/after/:userid
// GET /users/search/never-signed-in
// GET /users/search/same-day/:userid
// GET /users/search/today

app.listen(5050,
    () => {
        console.log("Listening on port 5050.")
    }
);
