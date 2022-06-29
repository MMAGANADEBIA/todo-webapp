//modules necessaryes to use a sqlite database and md5 hashes
const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const DBSOURCE = 'db.sqlite';
//variables to set an actual user
let id;
let user;
let password;
module.exports = {
  login: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //check if an error exist
        if (err) {
          console.log(err);
          throw err;
        } else {
          //if not error exists, get the data from the users database
          //and check if get some response
          //if gets a repsonse, then continue
          let data = 'SELECT id, name, password FROM users WHERE name = ? AND password = ?;'
          db.get(data, [req.body.name, md5(req.body.password)], (err, row) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              console.log(row);
              if (row !== undefined) {
                res.json({ message: 'accepted' })
                //set the actual user data
                id = row.id;
                user = row.name;
                password = row.password;
              }
              if (row == undefined) {
                //denied if not exist a row
                res.json({ message: 'denied' })
              }
            }
          })
        }
      })
    } catch (error) {
      console.error(error);
    }
  },
  getUser: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //error
        if (err) {
          console.log(err);
          throw err;
        } else {
          //get the actual user data
          let data = 'SELECT id, name, password FROM users WHERE id = ?;'
          db.get(data, id, (err, row) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              if (row !== undefined) {
                //return a response with the data user
                res.json({
                  id: row.id,
                  name: row.name,
                  password: row.password
                })
              }
              if (row == undefined) {
                //if get some error, then response with him 
                res.status(400).json({ "error": res.message })
              }
            }
          })
        }
      })
    } catch (error) {
      console.error(error);
    }
  },
  createAccount: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //run the query to create a table in the database in case it not exist
        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL);')
        //error
        if (err) {
          console.log(err);
          throw err;
        } else {
          //run the query to insert the a new user
          console.log('Connected to the SQLite database');
          // db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL);')
          let data = 'INSERT INTO users (name, password) VALUES(?,?);';
          db.run(data, [req.body.name, md5(req.body.password)], (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log("All well")
            }
          })
        }
      });
      db.close();
      res.json({ message: "Ok" });
    } catch (error) {
      console.error(error)
    }
  },
  addTask: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //create a table if not exist to store the tasks
        db.run('CREATE TABLE IF NOT EXISTS tasks (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT NOT NULL, description TEXT NOT NULL, id INTEGER, FOREIGN KEY (id) REFERENCES users(id));')
        if (err) {
          console.log(err);
          throw err;
        } else {
          console.log('Connected to the SQLite database');
          // let data = 'INSERT INTO tasks (task, description, id) VALUES(?,?,?);';
          //run the query to add a new task in the database
          db.run(data, [req.body.task, req.body.description, id], (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log("All right")
            }
          })
        }
      });
      db.close();
      res.json({ message: 'Ok' })
    } catch (error) {
      console.error(error);
    }
  },
  getTasks: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //query and run the query to get the task of a determinated user
        let data = `SELECT tasks.task_id, tasks.task, tasks.description FROM users INNER JOIN tasks on users.id = tasks.id WHERE users.id = ${id}`
        db.all(data, (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.json(rows);
          }
        })
      })
      db.close();
    } catch (error) {
      console.error(error);
    }
  },
  deleteTasks: async (req, res) => {
    try {
      //get the task from the post request
      let tasks = req.body.tasks;
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //error
        if (err) {
          console.error(err);
          throw err;
        } else {
          //walk the tasks_id from the array and delete it
          tasks.map((element) => {
            db.run(
              'DELETE FROM tasks WHERE task_id = ?',
              element,
              function(err, result) {
                if (err) {
                  res.status(400).json({ "error": res.message });
                }
              }
            )
          })
        }
      })
      db.close();
    } catch (error) {
      console.error(error);
    }
  },
  updateTask: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //error
        if (err) {
          console.error(err);
          throw err;
        } else {
          //run the query to update a task
          db.run(`UPDATE tasks set task = COALESCE(?, task), description = COALESCE(?, description) where task_id = ?`,
            [req.body.task, req.body.description, req.body.task_id],
            function(err, res) {
              if (err) {
                res.status(400).json({ "error": res.message })
                return;
              }
            }
          )
        }
      })
      db.close();
      res.json(req.body)
    } catch (error) {
      console.error(error);
    }
  },
  updateAccount: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //error
        if (err) {
          console.error(err);
          throw err;
        } else {
          //run the query to update the user data
          db.run(`UPDATE users set name = COALESCE(?, name), password = COALESCE(?, password) where id = ?`,
            [req.body.name ? req.body.name : user, req.body.password ? md5(req.body.password) : password, id],
            function(err, res) {
              if (err) {
                res.status(400).json({ "error": res.message })
                return;
              }
            }
          )
        }
      })
      db.close((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Closed the database connection.');
        }
      })
      res.json(req.body)
    } catch (error) {
      console.error(error);
    }
  },
  deleteAccount: async (req, res) => {
    try {
      //initialize the database
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        //error
        if (err) {
          console.error(err);
          throw err;
        } else {
          //run the query to delete the user from the database
          db.run('DELETE FROM users WHERE id = ?',
            id,
            function(err, result) {
              if (err) {
                res.status(400).json({ "error": res.message });
                db.close();
                return;
              }
              user = '';
            }
          )
          //run the query to delete all the task with the user id
          db.run('DELETE FROM tasks WHERE id = ?',
            id,
            function(err, result) {
              if (err) {
                res.status(400).json({ "error": res.message });
                db.close();
                return;
              }
            }
          )
        }
      })
      res.json({ message: 'Ok' })
    } catch (error) {
      console.error(error);
    }
  },
  exitSession: async (req, res) => {
    try {
      //clean the actual user information
      id = '';
      user = '';
      password = '';
      res.json({ message: 'Ok' })
    } catch (error) {
      console.error(error);
    }
  }
}
