
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// app.use(express.static('client/build'));

app.use(cors());
app.use(express.json());
app.use(require("./routes/routes"));
// app.use('/auth', require('./routes/auth'));
// app.use('/api', require('./routes/api'));
const dbo = require("./db/connection");

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});