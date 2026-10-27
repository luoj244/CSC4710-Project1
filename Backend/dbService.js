const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});

connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);
});

class DbService{
    static getDbServiceInstance(){
        return instance? instance: new DbService();
    }

  // Register and Sign-in

  async registerUser(username, password, firstname, lastname, salary, age){
      try{
           const registerday = new Date();
           const hashedPassword = await bcrypt.hash(password, 10);
           await new Promise((resolve, reject) => {
               const query = "INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, NULL);";
                connection.query(query, [username, hashedPassword, firstname, lastname, salary, age, registerday], (err, result) => {
                   if(err) reject(new Error(err.message));
                   else resolve(result);
               });
           });
           return {
                username: username,
                firstname: firstname,
                lastname: lastname,
                salary: salary,
                age: age,
                registerday: registerday
           };
      } catch(error){
           console.log(error);
           return { error: error.message };
      }
  }

async signInUser(username, password) {
    try {
        // Find the user by username
        const users = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE username = ?;";

            connection.query(query, [username], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });

        // Check whether the user exists
        if (!users || users.length === 0) {
            return {
                success: false,
                message: "Invalid username or password"
            };
        }

        // Compare entered password with stored bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            users[0].password
        );

        if (!passwordMatches) {
            return {
                success: false,
                message: "Invalid username or password"
            };
        }

        // Update the user's sign-in timestamp
        const signintime = new Date();

        await new Promise((resolve, reject) => {
            const query = "UPDATE Users SET signintime = ? WHERE username = ?;";

            connection.query(query, [signintime, username], (err, result) => {
                if (err) reject(new Error(err.message));
                else resolve(result);
            });
        });

        return {
            success: true,
            user: {
                username: users[0].username,
                firstname: users[0].firstname,
                lastname: users[0].lastname,
                signintime: signintime
            }
        };

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Sign-in failed"
        };
    }
}

  // --- Justin Tran: add search methods below ---


  // Requirement 3: Search users by first and/or last name
  async searchUsersByName(firstname, lastname) {
    try {
        let query = "SELECT username, firstname, lastname, salary, age, registerday, signintime FROM Users WHERE 1=1";
        const params = [];

        if (firstname) {
            query += " AND firstname LIKE ?";
            params.push(`%${firstname}%`);
        }

        if (lastname) {
            query += " AND lastname LIKE ?";
            params.push(`%${lastname}%`);
        }

        const results = await new Promise((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 4: Search users by User ID
async searchUserById(username) {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE username = ?
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, [username], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 5: Search users by salary range
async searchUsersBySalary(minSalary, maxSalary) {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE salary BETWEEN ? AND ?
            ORDER BY salary ASC
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, [minSalary, maxSalary], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 6: Search users by age range
async searchUsersByAge(minAge, maxAge) {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE age BETWEEN ? AND ?
            ORDER BY age ASC
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, [minAge, maxAge], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 7: Search users registered after a specific user
async searchUsersRegisteredAfter(userid) {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE registerday > (
                SELECT registerday
                FROM Users
                WHERE username = ?
            )
            ORDER BY registerday ASC
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, [userid], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 8: Search users who never signed in
async searchUsersNeverSignedIn() {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE signintime IS NULL
            ORDER BY username ASC
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 9: Search users registered on the same day
async searchUsersSameDayAs(userid) {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE registerday = (
                SELECT registerday
                FROM Users
                WHERE username = ?
            )
            ORDER BY username ASC
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, [userid], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}

// Requirement 10: Search users registered today
async searchUsersRegisteredToday() {
    try {
        const query = `
            SELECT username, firstname, lastname, salary,
                   age, registerday, signintime
            FROM Users
            WHERE registerday = CURDATE()
            ORDER BY username ASC
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        return results;

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}
}

module.exports = DbService;
