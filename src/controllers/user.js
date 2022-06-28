const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const DBSOURCE = 'db.sqlite';
let id;
let user;
let password;
module.exports = {
  index: async (req, res) => {
    try {
      res.sendFile('/views/index.html')
    } catch (error) {
      console.error(error);
    }
  },
  login: async (req, res) => {
    try {
      let name = req.body.name;
      let password = req.body.password;
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          let data = 'SELECT id, name, password FROM users WHERE name = ? AND password = ?;'
          db.get(data, [name, md5(password)], (err, row) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              console.log(row);
              if (row !== undefined) {
                res.json({ message: 'accepted' })
                id = row.id;
                user = row.name;
                password = row.password;
              }
              if (row == undefined) {
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
      // console.log(user)
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          let data = 'SELECT id, name, password FROM users WHERE id = ?;'
          db.get(data, id, (err, row) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              // console.log(row);
              if (row !== undefined) {
                res.json({
                  id: row.id,
                  name: row.name,
                  password: row.password
                })
              }
              if (row == undefined) {
                res.status(400).json({ "error": res.message })
              }
            }
          })
        }
      })
      // res.json({
      //   user: user,
      //   id: id
      // })
    } catch (error) {
      console.error(error);
    }
  },
  createAccount: async (req, res) => {
    try {
      let name = req.body.name;
      let password = req.body.password;
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL);')
        if (err) {
          console.log(err);
          throw err;
        } else {
          console.log('Connected to the SQLite database');
          //create table if not exists
          db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL);')
          let data = 'INSERT INTO users (name, password) VALUES(?,?);';
          db.run(data, [name, md5(password)], (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log("All well")
            }
          })
        }
      });
      db.close();
      res.json({ message: "0k" });
    } catch (error) {
      console.error(error)
    }
  },
  addTask: async (req, res) => {
    try {
      let task = req.body.task;
      let description = req.body.description;
      console.log(task, description);
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        db.run('CREATE TABLE IF NOT EXISTS tasks (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT NOT NULL, description TEXT NOT NULL, id INTEGER, FOREIGN KEY (id) REFERENCES users(id));')
        if (err) {
          console.log(err);
          throw err;
        } else {
          console.log('Connected to the SQLite database');
          //create table if not exists
          let data = 'INSERT INTO tasks (task, description, id) VALUES(?,?,?);';
          db.run(data, [task, description, id], (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log("All right")
            }
          })
        }
      });
      db.close();
      res.json({ message: '0k' })
    } catch (error) {
      console.error(error);
    }
  },
  getTasks: async (req, res) => {
    try {
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        let data = `SELECT tasks.task_id, tasks.task, tasks.description FROM users INNER JOIN tasks on users.id = tasks.id WHERE users.id = ${id}`
        db.all(data, (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(rows)
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
      // console.log(req.body)
      let tasks = req.body.tasks;
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          console.error(err);
          throw err;
        } else {
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
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          console.error(err);
          throw err;
        } else {
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
      console.log(req.body);
      console.log("updating")
      // let nName;
      // let newPassword;
      // if (req.body.newName) {
      //   
      // }
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          console.error(err);
          throw err;
        } else {
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
  }
}
