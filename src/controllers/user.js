const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const DBSOURCE = 'db.sqlite';
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
          let data = 'SELECT * FROM users WHERE name = ? AND password = ?;'
          db.get(data, [name, md5(password)], (err, row) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              // console.log(row);
              if (row !== undefined) {
                res.json({ message: 'accepted' })
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
  createAccount: async (req, res) => {
    try {
      let name = req.body.name;
      let password = req.body.password;
      let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          console.log('Connected to the SQLite database');
          //create table if not exists
          db.run('CREATE TABLE IF NOT EXISTS users (name TEXT NOT NULL, password TEXT NOT NULL);')
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
      db.close((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Closed the database connection.');
        }
      })
      res.json({ message: "0k" });
    } catch (error) {
      console.error(error)
    }
  }
}
