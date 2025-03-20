require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const debug = require('debug')('stellarwallet:server');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const indexRoutes = require("./routes/index");
const { Server } = require('http');

//using the routes
app.use('/api', indexRoutes)


//setting the home routes
app.get('/', (req, res)=> {
    res.setEncoding('welcome to stellar app');
});

//start server

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = Server