const mysql = require('mysql');
const dotenv = require('dotenv');
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
           // ? placeholders prevent SQL injection
           await new Promise((resolve, reject) => {
               const query = "INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, NULL);";
               connection.query(query, [username, password, firstname, lastname, salary, age, registerday], (err, result) => {
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

  async signInUser(username, password){
      try{
           // ? placeholders prevent SQL injection
           const users = await new Promise((resolve, reject) => {
               const query = "SELECT * FROM Users WHERE username = ? AND password = ?;";
               connection.query(query, [username, password], (err, results) => {
                   if(err) reject(new Error(err.message));
                   else resolve(results);
               });
           });

           if(!users || users.length === 0){
               return { success: false, message: "Invalid username or password" };
           }

           const signintime = new Date();
           await new Promise((resolve, reject) => {
               const query = "UPDATE Users SET signintime = ? WHERE username = ?;";
               connection.query(query, [signintime, username], (err, result) => {
                   if(err) reject(new Error(err.message));
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
      } catch(error){
           console.log(error);
           return { success: false, message: error.message };
      }
  }

  // --- Justin Tran: add search methods below ---
  // searchUsersByName(firstname, lastname)
  // searchUserById(username)
  // searchUsersBySalary(minSalary, maxSalary)
  // searchUsersByAge(minAge, maxAge)
  // searchUsersRegisteredAfter(userid)
  // searchUsersNeverSignedIn()
  // searchUsersSameDayAs(userid)
  // searchUsersRegisteredToday()
}

module.exports = DbService;
