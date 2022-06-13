//server 
const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
const port = (process.env.PORT || 3001);
const routes = require('./src/routes');

//server uses
app.use('/', routes);
app.use('/assets', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/client/public/'))
app.use(express.json())


//server listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
